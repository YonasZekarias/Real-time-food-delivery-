const mongoose = require("mongoose");
const Joi = require("joi");
const Restaurant = require("../models/Restaurant");
const User = require("../models/Users");
const Order = require("../models/Order");
const logger = require("../utils/logger");

const userRoleSchema = Joi.object({
  role: Joi.string()
    .valid("customer", "restaurant", "driver", "admin")
    .optional()
    .messages({
      "string.valid":
        "Role must be one of: customer, admin, restaurant, driver",
    }),
});

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json({ restaurants });
  } catch (err) {
    logger.err(`Error fetching restaurants: ${err.message}`);
    res.status(500).json({ message: "Error fetching users", err });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenue = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);

    res.status(200).json({
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalRevenue: revenue[0]?.totalRevenue || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats", err });
  }
};

// Admin: Get pending restaurants
const pendingRestaurant = async (req, res) => {
  try {
    const pending = await Restaurant.find({ verified: false, deleted: false });
    if (!pending.length)
      return res.status(404).json({ message: "No pending restaurants found" });
    res.status(200).json({ status: "success", data: { pending } });
    console.log(`Fetched pending restaurants: ${pending.length}`);
  } catch (error) {
    logger.error("Error fetching pending restaurants:", error);
    res.status(500).json({ message: "Failed to fetch pending restaurants" });
  }
};

// Admin: Verify restaurant
const verifyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    restaurant.verified = true;
    await restaurant.save();

    res.status(200).json({ message: "Restaurant verified successfully" });
  } catch (error) {
    logger.error("Error verifying restaurant:", error);
    res.status(500).json({ message: "Failed to verify restaurant" });
  }
};

const rejectRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid restaurant ID" });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { verified: false },
      { new: true }
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    res.json({ message: "Restaurant rejected successfully", restaurant });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    logger.error("Error verifying restaurant", err.message);
  }
};
const getAllUsers = async (req , res) => {
  try {
    const user = await User.find();
    if (!user) return res.status(404).json({message: "No user found"});
    res.status(200).json({users: user})

  } catch (error) {
    logger.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
}
const getUserByRoles = async (req, res) => {
  try {
    const { error, value } = userRoleSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }

    const { role } = value;

    const query = role ? { role } : {};
    logger.info(`Fetching users with query: ${JSON.stringify(query)}`);

    const users = await User.find(query).select("-password");
    const count = users.length;

    if (count === 0) {
      return res
        .status(400)
        .json({ message: "No users found for the specified role" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      data: { count, users },
    });
  } catch (err) {
    logger.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    id = id.replace(/['"]+/g, "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.set("suspendStatus", true, { strict: false }); 

    res.status(200).json({ message: "success", data: user });
  } catch (err) {
    logger.error(`Error suspending the user: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const getComplaints = async (req, res) => {
  try {
    const complaints = await Order.find({
      feedback: { $exists: true, $ne: null },
      rating: { $lt: 3 },
    })
      .select("customerId restaurantId rating feedback createdAt")
      .populate("customerId", "email")
      .populate("restaurantId", "name");
    if (!complaints.length) throw new Error("No complaints found");

    res.status(200).json({ message: "success", data: complaints });
  } catch (err) {
    logger.error("Error fetching complaints:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

const resolveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) throw new Error("Order not found");

    order.resolved = true; // 'resolved' will be added
    await order.save();
    res.status(200).json({ message: "success", data: order });
  } catch (err) {
    logger.error("Error resolving complaint:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  pendingRestaurant,
  verifyRestaurant,
  rejectRestaurant,
  getUserByRoles,
  getAllRestaurants,
  getPlatformStats,
  suspendUser,
  getComplaints,
  resolveComplaint,
};
