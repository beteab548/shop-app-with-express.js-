const path = require("path");
const isAuth = require("../middleware/isAuth");
const express = require("express");
const adminController = require("../controllers/admin");
const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// // /admin/products => GET

// // /admin/add-product => POST
router.post("/add-product", isAuth, adminController.postAddProduct);

router.get("/products", isAuth, adminController.getProducts);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post("/edit-product", isAuth, adminController.postEditProduct);

router.get(
  "/delete-product/:productId",
  isAuth,
  adminController.deleteProduct
);
module.exports = router;
