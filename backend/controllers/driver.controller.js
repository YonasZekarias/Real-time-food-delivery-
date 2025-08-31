const User = require("../models/Users");  
const Order = require("../models/Order");
const logger = require("../utils/logger");
const mongoose = require("mongoose");
const registerDriver = async (req, res) => {
    try {
        const { email, phone, password, name, restaurantId } = req.body;

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "Driver already exists" });

        // Create user
        const user = await User.create({ email, phone, password, role: "driver", restaurantId });
        res.status(201).json({ status: "success", data: { user } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const driverOrders = async (req, res) => {
    try {
        const {driverId} = req.params;
        const driver = await User.find({ _id: driverId });
        if (!driver) return res.status(404).json({ message: "Driver not found" });
        const orders = await Order.find({ driverId: driverId });
        if (!orders) return res.status(404).json({ message: "No orders found for this driver" });
        res.status(200).json({ status: "success", data: { driver, orders } });

    } catch (error) {
        logger.error(`Error fetching driver orders: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}
const changeDriverStatus = async (req, res) => {
    try {
        const driver = await User.findById(req.user._id);
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        driver.status = req.body.status;
        await driver.save();

        res.status(200).json({ status: "success", data: { driver } });
    } catch (error) {
       logger.error(`Error changing driver status: ${error.message}`);
       res.status(500).json({ message: error.message });
    }
}



const dailyAndTotalEarning = async (req, res) => {
  try {
    const { driverId } = req.params;

    const driver = await User.findById(driverId);
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    // Date ranges
    const startOfDay = new Date(new Date().setHours(0, 0, 0, 0));
    const endOfDay = new Date(new Date().setHours(23, 59, 59, 999));
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    startOfWeek.setHours(0, 0, 0, 0);

    const [todaysOrderCount, todayEarnings, weeklyEarning, totalEarnings] =
      await Promise.all([
        // Orders today
        Order.countDocuments({
          driverId: driverId,
          deleted: false,
          createdAt: { $gte: startOfDay, $lt: endOfDay },
        }),

        // Today's earnings
        Order.aggregate([
          {
            $match: {
              driverId: driverId,
              deleted: false,
              createdAt: { $gte: startOfDay, $lt: endOfDay },
            },
          },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),

        // Weekly earnings
        Order.aggregate([
          {
            $match: {
              driverId: driverId,
              deleted: false,
              createdAt: { $gte: startOfWeek, $lt: new Date() },
            },
          },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),

        // Total earnings
        Order.aggregate([
          { $match: { driverId: driverId, deleted: false } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);

    res.status(200).json({
      status: "success",
      data: {
        todaysOrderCount,
        todayEarnings: todayEarnings[0]?.total || 0,
        weeklyEarning: weeklyEarning[0]?.total || 0,
        totalEarnings: totalEarnings[0]?.total || 0,
      },
    });
  } catch (error) {
    logger.error(`Error fetching driver earnings: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
    registerDriver,
    driverOrders,
    changeDriverStatus,
    dailyAndTotalEarning
}