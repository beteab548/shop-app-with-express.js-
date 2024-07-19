const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);
const user = require("./models/user");
const multer = require("multer");
const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const csurf = require("csurf");
const flash = require("connect-flash");
const { error } = require("console");
app.set("view engine", "ejs");
app.set("views", "views");
// "mongodb+srv://endoumamure:endou1234@cluster0.ewomkce.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb://0.0.0.0:27017/shop";
app.use(cookieParser());
const store = new mongoStore({ uri: uri, collection: "sessions" });
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(bodyParser.urlencoded({ extended: false }));
const csurfProtection = csurf();
app.use(csurfProtection);
app.use(flash());
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  } else {
    user
      .findById(req.session.user._id)
      .then((data) => {
        req.user = data;
      })
      .then(() => {
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  }
});
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
// app.use((error, req, res, next) => {
//   return res.redirect("/500");
// });
app.get("/500", errorController.get500);
app.use(errorController.get404);
mongoose
  .connect(uri)
  .then(() => {
    console.log("connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
