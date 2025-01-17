const path = require("path");

const express = require("express");
const isAuth = require("../middleware/isAuth");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProduct);

router.get("/cart/", isAuth, shopController.getCart);

router.post("/cart/", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCartDeleteProduct);

router.get("/orders", isAuth, shopController.getOrders);
router.get("/invoice/:orderId", isAuth, shopController.getInvoice);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
