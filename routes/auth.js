const express = require("express");
const { body } = require("express-validator");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.post("/login",authController.postLogin);
router.post("/logout", authController.postLogOut);
router.get("/signup", authController.getsignUp);
router.post(
  "/signup",
  body("email").isEmail().withMessage("please enter a valid email!"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must at least be 6 digit"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value === req.body.Password) {
        return true;
      } else {
        throw new error(`passwords don't match`);
      }
    })
    .withMessage("passwords dont match"),
  authController.postSignUp
);
router.get("/resetpwd", authController.getResetpwd);
module.exports = router;
