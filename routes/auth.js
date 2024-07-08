const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogOut);
router.get("/signup", authController.getsignUp);
router.post("/signup", authController.postSignUp);

module.exports = router;
