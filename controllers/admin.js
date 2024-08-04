const product = require("../models/product");
const { ObjectId } = require("mongodb");
const fileHepler = require("../util/file-helper");
const { header } = require("express-validator");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  product
    .create({
      title: title,
      price: price,
      imageUrl: image.path,
      description: description,
      userId: req.user._id,
    })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = new ObjectId(req.body.productId);
  const image = req.file;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedDesc = req.body.description;
  product
    .find({ _id: prodId, userId: req.user._id })
    .then((products) => {
      let productValue = products[0];
      if (products.length > 0) {
        if (image) {
          fileHepler(productValue.imageUrl);
          productValue.imageUrl = image.path;
        }
        productValue.title = updatedTitle;
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
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = new ObjectId(req.params.productId);
  product
    .findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error("no product found"));
      }
      fileHepler(product.imageUrl);
      product.deleteOne({ _id: prodId, userId: req.user._id }).then(() => {
        res.status(200).json({ message: "successfully deleted an item!" });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "error deleting an item!" });
      console.log(err);
    });
};
