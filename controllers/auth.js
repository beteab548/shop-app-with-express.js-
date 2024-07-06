exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};
exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  req.session.save((err) => {
    console.log(err);
    res.redirect("/");
  });
};
exports.getLogOut = (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/");
    console.log(err);
  });
};
exports.getsignUp = (req, res, next) => {
  res.render("auth/sign-up", {
    pageTitle: "signup",
    path: "signup",
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.postSignUp = (req, res, next) => {
  res.redirect("/login");
};
