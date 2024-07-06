const product = require("../models/product");
const Product = require("../models/product");
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  product.findById(prodId).then((product) => {
    req.user
      .addToCart(product)
      .then(() => {})
      .catch((err) => {
        console.log(err);
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
    console.log(product);
    res.render("shop/orders", {
      products: product,
      path: "/orders",
      pageTitle: "Your Orders",
      isAuthenticated: req.session.isLoggedIn,
    });
  });
};
// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };