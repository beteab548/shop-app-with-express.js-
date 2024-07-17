const { validationResult } = require("express-validator");
const user = require("../models/user");
const bcrypt = require("bcryptjs");
exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length <= 0) {
    message = null;
  } else {
    message = message[0];
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    error: message,
  });
};
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  user
    .findOne({ email: email })
    .then((userData) => {
      if (userData !== null) {
        bcrypt
          .compare(password, userData.password)
          .then((value) => {
            if (value == true) {
              req.session.user = userData;
              req.session.isLoggedIn = true;
              req.session.save(() => {
                res.redirect("/");
              });
            } else {
              req.flash("error", "password is incorrect");
              res.redirect("/login");
            }
          })
          .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
      } else {
        req.flash("error", "email was not found");
        res.redirect("/login");
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogOut = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
    console.log(err);
  });
};
exports.getsignUp = (req, res, next) => {
  let errors = validationResult(req).errors;
  if (errors.length === 0) {
    errors[0] = null;
  }
  res.render("auth/sign-up", {
    pageTitle: "signup",
    path: "/signup",
    error: errors[0],
    inputValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    invalidMarker: null,
  });
};
exports.postSignUp = (req, res, next) => {
  const errors = validationResult(req).errors;
  const invalidMarker = errors[0].path;
  const { email, password, confirmPassword } = req.body;
  if (errors.length === 0) {
    bcrypt.hash(password, 12).then((hashedPwd) => {
      user
        .create({ email: email, password: hashedPwd })
        .then(() => {
          res.redirect("/login");
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    });
  } else {
    res.render("auth/sign-up", {
      pageTitle: "signup",
      path: "/signup",
      error: errors[0],
      inputValues: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      invalidMarker: invalidMarker,
    });
  }
};
exports.getResetpwd = (req, res, next) => {
  req.flash("error", "This feature is not available right now!");
  res.render("auth/reset-pwd", {
    path: "/reset",
    pageTitle: "reset password",
    error: req.flash("error"),
  });
};
