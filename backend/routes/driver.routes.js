const express = require("express");
const protect = require("../middlewares/auth.middleware"); 
const restrictTo = require("../middlewares/restrictTo")
const {
    registerDriver,
    driverOrders,
    changeDriverStatus,
    dailyAndTotalEarning
} = require("../controllers/driver.controller");
const router = express.Router();

router.post("/register", registerDriver);
router.get("/:driverId/orders", protect, restrictTo("driver","admin","restaurant"), driverOrders);
router.patch("/status", protect,restrictTo("driver") ,changeDriverStatus);
router.get("/:driverId/earnings", protect, restrictTo("driver","admin","restaurant"), dailyAndTotalEarning);

module.exports = router;
