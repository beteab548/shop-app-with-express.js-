const { Schema, Mongoose, model } = require("mongoose");
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
});
const product = model("product", productSchema);
module.exports = product;
