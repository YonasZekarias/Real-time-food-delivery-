const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [itemSchema],
  total: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: [
      "pending",
      "accepted",
      "preparing",
      "ready",
      "picked",
      "en_route",
      "delivered",
      "canceled",
    ],
    default: "pending",
  },
  deliveryLocation: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "mobile_banking", "card"],
    required: true,
  },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String, trim: true },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

orderSchema.index({ deliveryLocation: "2dsphere" });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1 });
orderSchema.index({ driverId: 1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);
