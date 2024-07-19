const Product = require("../models/product");
const orders = require("../models/orders");
const user = require("../models/user");
const fs = require("fs");
const path = require("path");
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
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  if (cart.length <= 0) {
    orders.findOne({ userId: req.user._id }).then((order) => {
      order.items.map((p) => {
        totalQuantity = p.quantity + totalQuantity;
      });
      if (order) {
        res.render("shop/orders", {
          order: order,
          path: "/orders",
          pageTitle: "Your Orders",
          totalQuantitys: totalQuantity,
        });
      }
    });
  } else {
    orders
      .findOne({ userId: req.user._id })
      .then(() => {
        orders
          .findOneAndUpdate({ items: cart, userId: req.user._id })
          .then((order) => {
            if (order) {
              res.render("shop/orders", {
                order: order,
                path: "/orders",
                pageTitle: "Your Orders",
                totalQuantitys: totalQuantity,
              });
            }
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  req.user.cleanCart();
  // orders.create({ items: cart, userId: req.user._id })
  // .then(() => {
  // });
};
// exports.getInvoice = (req, res, next) => {
//   fs.readFile("C:/Users/Super Pawn/Desktop/invoice.pdf", (err, fileData) => {
//     res.setHeader("content-type", "application/pdf");
//     res.setHeader("content-disposition", "inline; filename=invlice.doc");
//     res.send(fileData);
//   });
// };
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
