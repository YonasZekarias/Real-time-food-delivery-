const mongoose = require("mongoose");
const Restaurant = require("../models/Restaurant");
const logger = require("../utils/logger");
const User = require("../models/Users");
const Order = require("../models/Order");
const { client: redisClient } = require("../config/redis");
const { sendOTP } = require("../utils/afroMessage");
// Helper to check ownership
const checkOwnership = (restaurant, user) => {
  if (!restaurant.ownerId.equals(user._id)) {
    return false;
  }
  return true;
};

// Get all verified, non-deleted restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      deleted: false,
      verified: true,
    });
    res.status(200).json(restaurants);
  } catch (err) {
    logger.error("Failed to fetch restaurants:", err);
    res.status(500).json({ error: "Failed to fetch restaurants." });
  }
};

// Get single restaurant by ID
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      deleted: false,
      verified: true,
    });

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found." });
    }

    res.status(200).json(restaurant);
  } catch (err) {
    logger.error("Failed to fetch restaurant:", err);
    res.status(500).json({ error: "Failed to fetch restaurant." });
  }
};

// Add menu item
const addMenuItem = async (req, res) => {
  try {
    const { name, price, description, image, inStock } = req.body;

    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    if (!checkOwnership(restaurant, req.user)) {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not the owner" });
    }

    if (!Array.isArray(restaurant.menu)) restaurant.menu = [];

    restaurant.menu.push({ name, price, description, image, inStock });
    await restaurant.save();

    res.status(201).json({ message: "Menu item added", menu: restaurant.menu });
  } catch (error) {
    logger.error("Error adding menu item:", error);
    res
      .status(500)
      .json({ error: "Failed to add menu item", details: error.message });
  }
};

// Delete menu item
const deleteMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    if (req.user.role !== "admin" && !checkOwnership(restaurant, req.user)) {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not the owner" });
    }

    restaurant.menu = restaurant.menu.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await restaurant.save();
    res.json({ message: "Menu item removed", menu: restaurant.menu });
  } catch (err) {
    logger.error("Failed to remove menu item:", err);
    res.status(500).json({ error: "Failed to remove menu item" });
  }
};

// Update menu item
const updateMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    if (!checkOwnership(restaurant, req.user)) {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not the owner" });
    }

    const menuItem = restaurant.menu.id(req.params.itemId);
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });

    const { name, price, description, image, inStock } = req.body;
    if (name !== undefined) menuItem.name = name;
    if (price !== undefined) menuItem.price = price;
    if (description !== undefined) menuItem.description = description;
    if (image !== undefined) menuItem.image = image;
    if (inStock !== undefined) menuItem.inStock = inStock;

    await restaurant.save();
    res.json({ success: true, updatedItem: menuItem });
  } catch (err) {
    logger.error("Update error:", err);
    res.status(500).json({ error: "Server error during update" });
  }
};
// Register restaurant (creates user + restaurant)
const registerRestaurant = async (req, res) => {
  try {
    const { email, phone, password, name, location, image } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist)
      return res.status(400).json({ message: "Restaurant already exists" });

    const user = await User.create({
      email,
      phone,
      password,
      role: "restaurant",
    });
    logger.info("Restaurant user created:", user._id);

    const restaurant = await Restaurant.create({
      name,
      location,
      ownerId: user._id,
      image,
    });
    const { verificationCode, code } = await sendOTP(phone);
    try {
      const result = await redisClient.setEx(
        `otp:${phone}`,
        300,
        JSON.stringify({ code, verificationCode })
      );
      logger.info(`Redis set results: ${result}`);
    } catch (err) {
      logger.error(`Redis set error: ${err.message}`);
    }

    res.status(201).json({ status: "success", data: { restaurant } });
  } catch (err) {
    logger.error("Error registering restaurant:", err);
    res.status(500).json({ message: err.message });
  }
};
// Get restaurant menu
const getMenus = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    res.status(200).json(restaurant.menu);
  } catch (err) {
    logger.error("Failed to fetch menu:", err);
    res.status(500).json({ error: "Failed to fetch menu" });
  }
};
const getMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const menuItem = restaurant.menu.id(req.params.itemId);
    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.status(200).json(menuItem);
  } catch (err) {
    logger.error("Failed to fetch menu item:", err);
    res.status(500).json({ error: "Failed to fetch menu item" });
  }
};
const updateInventory = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });

    if (!checkOwnership(restaurant, req.user)) {
      return res
        .status(403)
        .json({ error: "Forbidden: You are not the owner" });
    }

    const { menuItemId, quantity } = req.body;
    const menuItem = restaurant.menu.id(menuItemId);
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });

    menuItem.inStock = quantity > 0;
    menuItem.quantity = quantity;

    await restaurant.save();
    res.json({ success: true, updatedItem: menuItem });
  } catch (err) {
    logger.error("Update error:", err);
    res.status(500).json({ error: "Server error during update" });
  }
};

const restaurantStats = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;
    const totalOrders = await Order.countDocuments({ restaurantId });
    const totalRevenue = await Order.aggregate([
      { $match: { restaurantId } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    res.status(200).json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (err) {
    logger.error("Failed to fetch restaurant stats:", err);
    res.status(500).json({ error: "Failed to fetch restaurant stats" });
  }
};
const getAllOrder = async (req, res) => {
  try {
    const restaurantId = req.params.restaurantId;

    // Find the restaurant
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Authorization check (only owner or admin can access)
    if (
      req.user.role !== "admin" &&
      !restaurant.ownerId.equals(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to access this restaurant's orders" });
    }

    // Fetch orders
    const orders = await Order.find({ restaurantId }).populate(
      "customerId",
      "name email phone"
    );

    res.status(200).json({ orders });
  } catch (error) {
    logger.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// const getAllOrder = async (req, res) => {
//   try {
//     const restaurantId = req.params.restaurantId;
//     const restaurant = await Restaurant.findOne({ ownerId: restaurantId });
//     if (!restaurant) {
//       return res
//         .status(403)
//         .json({ message: "Not authorized: Restaurant not found" });
//     }

//     const orders = await Order.find({ restaurantId }).populate(
//       "customerId",
//       "name email phone"
//     );
//     res.status(200).json({ orders });
//   } catch (error) {
//     logger.error("Error fetching orders:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate(
      "customerId",
      "name email phone"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ order });
  } catch (error) {
    logger.error("Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const inviteDriver = async (req, res) => {
  try {
    const { phone } = req.body;

    // restaurant making the request (owner from JWT payload)
    const restaurantOwnerId = req.user._id;

    // find the restaurant for this owner
    const restaurant = await Restaurant.findOne({ ownerId: restaurantOwnerId });
    if (!restaurant) {
      return res
        .status(403)
        .json({ message: "Not authorized: Restaurant not found" });
    }

    // find the user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // if already driver for this restaurant
    if (
      user.role === "driver" &&
      user.restaurantId?.toString() !== restaurant._id.toString()
    ) {
      return res
        .status(400)
        .json({ message: "User is already a driver for another restaurant" });
    }
    if (
      user.role === "driver" &&
      user.restaurantId?.toString() === restaurant._id.toString()
    ) {
      return res
        .status(400)
        .json({ message: "User is already a driver for this restaurant" });
    }

    user.role = "driver";
    user.restaurantId = restaurant._id;
    await user.save();

    res.status(200).json({
      message: "Driver invited successfully",
      driver: {
        id: user._id,
        phone: user.phone,
        restaurantId: restaurant._id,
      },
    });
  } catch (error) {
    logger.error("Error inviting driver:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const assignDriverToOrder = async (req, res) => {
  try {
    const { orderId, driverId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.driverId = driverId;
    await order.save();
    res.status(200).json({ message: "Driver assigned to order", order });
  } catch (error) {
    logger.error("Error assigning driver to order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const activeDrivers = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res
        .status(403)
        .json({ message: "Not authorized: Restaurant not found" });
    }
    const restaurantId = restaurant._id;
    // Find active drivers for this restaurant
    const drivers = await User.find({
      role: "driver",
      restaurantId: mongoose.Types.ObjectId(restaurantId),
      status: "active",
    });
    res.status(200).json({ drivers });
  } catch (error) {
    logger.error("Error fetching active drivers:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const restaurantOrderStat = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) {
      return res
        .status(403)
        .json({ message: "Not authorized: Restaurant not found" });
    }
    const restaurantId = restaurant._id;

    // Get order statistics for the restaurant
    const totalOrders = await Order.countDocuments({ restaurantId });
    const completedOrders = await Order.countDocuments({
      restaurantId,
      status: "completed",
    });
    const pendingOrders = await Order.countDocuments({
      restaurantId,
      status: "pending",
    });
    const preparingOrders = await Order.countDocuments({
      restaurantId,
      status: "preparing",
    });
    const deliveringOrders = await Order.countDocuments({
      restaurantId,
      status: { $in: ["picked", "en_route"] },
    });
    const cancelledOrders = await Order.countDocuments({
      restaurantId,
      status: "cancelled",
    });
    res.status(200).json({
      totalOrders,
      completedOrders,
      pendingOrders,
      preparingOrders,
      deliveringOrders,
      cancelledOrders,
    });
  } catch (error) {
    logger.error("Error fetching restaurant order statistics:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getAllRestaurants,
  getRestaurantById,
  addMenuItem,
  deleteMenuItem,
  updateMenuItem,
  registerRestaurant,
  getMenus,
  getMenuItem,
  updateInventory,
  restaurantStats,
  getAllOrder,
  getOrderById,
  inviteDriver,
  assignDriverToOrder,
  activeDrivers,
  restaurantOrderStat
};
