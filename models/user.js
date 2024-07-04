const { Schema, model, Mongoose } = require("mongoose");
const { schema, updateSearchIndex } = require("./product");
const userSchema = new Schema({
  name: String,
  emial: String,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
  orders: {
    items: [{}],
  },
});
userSchema.methods.addToCart = function (product) {
  //check if product exist in the cart
  const productIndex = this.cart.items.findIndex((p) => {
    return p.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  updatedCart = [...this.cart.items];
  //if product exist
  if (productIndex >= 0) {
    updatedCart[productIndex].quantity += 1;
  } else {
    updatedCart.push({ productId: product._id, quantity: newQuantity });
  }
  this.cart.items = updatedCart;
  return this.save();
  
};
userSchema.methods.removeCartItem = function (prodId) {
  const updatedCart = this.cart.items.filter((p) => {
    return p.productId.toString() !== prodId.toString();
  });
  this.cart.items = updatedCart;
  return this.save();
};
userSchema.methods.getOrders = function () {
  const order = [...this.cart.items];
  this.orders.items = order;
  this.cart.items = [];
  return this.save();
};
const user = model("user", userSchema);
module.exports = user;
