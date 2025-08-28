const Cart = require("../models/Cart");
const Restaurant = require("../models/Restaurant");
const { checkCache } = require("../utils/cache");
const { client: redisClient } = require("../config/redis");
const logger = require("../utils/logger");

exports.addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity, restaurantId } = req.body;
    logger.info("=== BACKEND ADD TO CART DEBUG ===");
    logger.info("Request body:", { menuItemId, quantity, restaurantId });
    
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      deleted: false,
    });
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    logger.info("Restaurant found:", { name: restaurant.name, menuCount: restaurant.menu.length });
    logger.info("Looking for menu item with ID:", menuItemId);
    
    const menuItem = restaurant.menu.id(menuItemId);
    logger.info("Menu item found:", menuItem ? { id: menuItem._id, name: menuItem.name, price: menuItem.price } : "NOT FOUND");
    
    if (!menuItem || !menuItem.inStock)
      return res
        .status(404)
        .json({ message: "Menu item not found or unavailable" });

    let cart = await Cart.findOne({ customerId: req.user._id, restaurantId });
    if (!cart) {
      cart = new Cart({
        customerId: req.user._id,
        restaurantId,
        items: [],
        total: 0,
      });
    } else if (cart.restaurantId.toString() !== restaurantId) {
      return res
        .status(400)
        .json({ message: "Cart can only contain items from one restaurant" });
    }

    const existingItem = cart.items.find(
      (item) => item.menuItemId.toString() === menuItemId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = {
        menuItemId,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
      };
      logger.info("Adding new item to cart:", newItem);
      cart.items.push(newItem);
    }

    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    logger.info("Final cart items before save:", cart.items.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })));
    await cart.save();
    await redisClient.del(`cart:${req.user._id}`);

    res.status(201).json({ message: "success", data: cart });
  } catch (err) {
    logger.error(`Error adding to cart: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    item.quantity = quantity;
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();
    await redisClient.del(`cart:${req.user._id}`);
    res.status(200).json({ message: "success", data: cart });
  } catch (err) {
    logger.error(`Error updating cart item: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { restaurantId } = req.params;

    const cart = await Cart.findOneAndDelete({ customerId, restaurantId });

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Cart not found for this restaurant" });
    }

    return res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting cart: ${error.message}`);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findOne({ customerId: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(id);
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    cart.items.pull(id);
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    await redisClient.del(`cart:${req.user._id}`);
    res.status(200).json({ message: "success", data: cart });
  } catch (err) {
    logger.error(`Error removing item from cart: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cacheKey = `cart:${req.user._id}`;
    const cached = await checkCache(cacheKey);
    if (cached) {
      return res.status(200).json({ message: "success", data: cached });
    }

    const cart = await Cart.findOne({ customerId: req.user._id }).populate(
      "restaurantId",
      "name"
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    await redisClient.setEx(cacheKey, 300, JSON.stringify(cart));
    res.status(200).json({ message: "success", data: cart });
  } catch (err) {
    logger.error(`Error fetching cart: ${err.message}`);
    res.status(500).json({ message: "Server error" });
  }
};
