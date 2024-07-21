const { Schema, model } = require("mongoose");
const ordersSchema = new Schema({
  items: [
    {
      productId: { type: Schema.Types.String, ref: "product" },
      quantity: { type: Schema.Types.Number },
    },
  ],
  userId: { type: Schema.Types.String, ref: "user", required: true },
});
const orders = model("orders", ordersSchema);
module.exports = orders;
