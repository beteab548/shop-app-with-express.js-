const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");
const user = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);
router.post("/logout", authController.postLogOut);
router.get("/signup", authController.getsignUp);
router.post(
  "/signup",
  body("email", "please enter a valid email!")
    .isEmail()
    .custom(async (value) => {
      const users = await user.findOne({ email: value });
      if (users) {
        return Promise.reject("email already exists");
      }
    }),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("password must at least be 6 digit"),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value === req.body.password) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage("password dont match"),
  authController.postSignUp
);
router.get("/resetpwd", authController.getResetpwd);
module.exports = router;
