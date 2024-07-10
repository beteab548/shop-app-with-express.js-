const product = require("../models/product");
const { ObjectId } = require("mongodb");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  product
    .create({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
      userId: req.user._id,
    })
    .then((data) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getProducts = (req, res, next) => {
  product
    .find({ userId: req.user._id })
    .then((product) => {
      res.render("admin/products", {
        prods: product,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  product
    .findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = new ObjectId(req.body.productId);
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  product
    .find({ _id: prodId, userId: req.user._id })
    .then((products) => {
      let productValue = products[0];
      if (products.length > 0) {
        productValue.title = updatedTitle;
        productValue.imageUrl = updatedImageUrl;
        productValue.price = updatedPrice;
        productValue.description = updatedDesc;
        return productValue.save();
      } else {
        return res.redirect("/");
      }
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = new ObjectId(req.body.productId);
  product.deleteOne({ _id: prodId, userId: req.user._id }).then(() => {
    console.log("deleted successful");
    res.redirect("/admin/products");
  });
};
