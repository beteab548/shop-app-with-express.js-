const product = require("../models/product");
const Product = require("../models/product");
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
  product.findById(prodId).then((product) => {
    req.user
      .addToCart(product)
      .then(() => {})
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
exports.getOrders = (req, res, next) => {
  req.user.getOrders().then((data) => {
    const product = [...data.orders.items];
    res.render("shop/orders", {
      products: product,
      path: "/orders",
      pageTitle: "Your Orders",
    });
  });
};
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
