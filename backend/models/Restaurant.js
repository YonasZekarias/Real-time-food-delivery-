const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  image: { type: String, trim: true },
  inStock: { type: Boolean, default: true },
});
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true },
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: { type: String, trim: true },
  menu: [menuItemSchema],
  verified: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

restaurantSchema.index({ location: "2dsphere" });
restaurantSchema.index({ ownerId: 1 });

module.exports = mongoose.model("Restaurant", restaurantSchema);
