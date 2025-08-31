const Order = require("../models/Order");
const { client: redisClient } = require("../config/redis");
const logger = require("../utils/logger");
const User= require('../models/Users')
exports.getUserFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await Order.find({
      customerId: id,
      rating: {
        $exists: true,
        $ne: null,
      },
    })
      .select("rating feedback createdAt")
      .populate("restaurantId", "name");
    if (!orders.length) throw new Error("No feedback found for this user");

    await redisClient.setEx(`feedback:${id}`, 3600, JSON.stringify(orders));
    res.status(200).json({ message: "success", data: orders });
  } catch (err) {
    logger.error(`Error fetching feedback: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
exports.userInfo = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "success", data: user });
  } catch (error) {
    logger.error(`Error fetching user info: ${error.message}`);
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
}