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
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getProducts = (req, res, next) => {
  product
    .find()
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
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  product
    .findById(prodId)
    .then((products) => {
      products.title = updatedTitle;
      products.imageUrl = updatedImageUrl;
      products.price = updatedPrice;
      products.description = updatedDesc;
      products.save();
    })
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = new ObjectId(req.body.productId);
  product.findByIdAndDelete(prodId).then(() => {
    console.log("deleted successful");
    res.redirect("/admin/products");
  });
};
