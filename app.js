const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongodb-session")(session);
const user = require("./models/user");
const errorController = require("./controllers/error");
app.set("view engine", "ejs");
app.set("views", "views");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const uri =
  "mongodb+srv://endoumamure:endou1234@cluster0.ewomkce.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0";
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
app.use((req, res, next) => {
  user
    .findById("6683113c066b950f5f242c5f")
    .then((data) => {
      req.user = data;
    })
    .then(() => {
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

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
