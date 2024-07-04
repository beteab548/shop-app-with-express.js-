const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const user = require("./models/user");
const errorController = require("./controllers/error");
app.set("view engine", "ejs");
app.set("views", "views");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
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
// .then((users) => {
//   if (users == null) {
//     user.create({
//       name: "beteab",
//       emial: "bet@gamil.com",
//       cart: { items: [] },
//     });
//   }
// })
// .then((data) => {
//   console.log(data);
//   // req.user = users;
// })
// .catch((err) => {
//   console.log(err);
// });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
mongoose
  .connect(
    "mongodb+srv://endoumamure:endou1234@cluster0.ewomkce.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
