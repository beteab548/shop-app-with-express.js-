const Product = require("../models/product");
const orders = require("../models/orders");
const user = require("../models/user");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");
const pdfDocument = require("pdfkit");
const product = require("../models/product");
let totalItems = 0;
let items_per_page = 3;
const pdf = new pdfDocument();
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: "product-detail",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;
  Product.find()
    .countDocuments()
    .then((total) => {
      return (totalItems = total);
    })
    .then(() => {
      product
        .find()
        .skip((page - 1) * items_per_page)
        .limit(items_per_page)
        .then((products) => {
          console.log(page > 1);
          res.render("shop/index", {
            prods: products,
            pageTitle: "Shop",
            path: "/",
            currentPage: 1,
            hasNextPage: page * items_per_page < totalItems,
            hasPreviousePage: page > 1,
            nextPage: page + 1,
            previousePage: page - 1,
            lastPage: Math.ceil(totalItems / items_per_page),
          });
        });
    })
    .catch((err) => {
      console.log(err);
      //   const error = new Error(err);
      //   error.httpStatusCode = 500;
      //   return next(error);
    });
};
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((data) => {
      let products = [...data.cart.items];
      // console.log(data.cart.items);
      res.render("shop/cart", {
        products: products,
        pageTitle: "cart",
        path: "/cart",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId).then((product) => {
    req.user
      .addToCart(product)
      .then(() => {
        res.redirect("/cart");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.removeCartItem(prodId).then(() => {
    res.redirect("/cart");
  });
};
exports.getOrders = async (req, res, next) => {
  const cart = await req.user.getCart();
  let totalQuantity = 0;
  orders.findOne({ userId: req.user._id }).then((order) => {
    if (!order) {
      orders.create({ items: [], userId: req.user._id });
      return res.redirect("/orders");
    } else {
      order.items.map((p) => {
        totalQuantity = p.quantity + totalQuantity;
      });
      if (cart.length <= 0) {
        res.render("shop/orders", {
          order: order,
          path: "/orders",
          pageTitle: "Your Orders",
          totalQuantitys: totalQuantity,
        });
      } else {
        orders.findOne({ userId: req.user._id }).then((order) => {
          if (order) {
            order.items = cart;
            order.save().then(() => {
              res.render("shop/orders", {
                order: order,
                path: "/orders",
                pageTitle: "Your Orders",
                totalQuantitys: totalQuantity,
              });
            });
          } else {
            const err = new Error(
              `no matching order found for the user with ID:${req.user._id}`
            );
            next(err);
          }
        });
      }
      req.user.cleanCart();
    }
  });
};
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  const invoiceName = "invoice" + orderId + ".pdf";
  const invoicePath = path.join("invoice", invoiceName);
  orders
    .findById(orderId)
    .populate("items.productId")
    .then((order) => {
      if (!order) {
        return next(new Error("not elligible"));
      }
      if (order.userId.toString() !== req.user._id.toString()) {
        return next(new Error("not elligible"));
      }
      res.setHeader("content-type", "application/pdf");
      res.setHeader("content-disposition", `inline; filename=${orderId}.pdf`);
      pdf.pipe(fs.createWriteStream(invoicePath));
      pdf.pipe(res);
      let toatlPrice = 0;
      order.items.forEach((p) => {
        const productsTitle = p.productId.title;
        const quantity = p.quantity;
        const price = p.productId.price;
        toatlPrice = parseInt(p.productId.price) + parseInt(toatlPrice);
        pdf.text(`product name :${productsTitle}`);
        pdf.text("----------------------------");
        pdf.text(`quantity:${quantity} * ${price}$`);
        pdf.text("----------------------------");
      });
      pdf.text(`total price :${toatlPrice}$`);
      pdf.end();
    })
    .catch((err) => {
      console.log(err);
    });
};
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
