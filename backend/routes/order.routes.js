const express = require("express");
const {
  createOrder,
  getOrderHistory,
  changeOrderStatus,
  storeFeedback, // This function comes from the 'beki.b' branch
} = require("../controllers/order.controller");
const {
  validateCreateOrder,
  validateFeedback, // This validator comes from the 'beki.b' branch
} = require("../validators/orderValidator");
const protect = require("../middlewares/auth.middleware.js");
const restrictTo = require("../middlewares/restrictTo");

const router = express.Router();

router.post(
  "/",
  protect, // Keep active as per the 'main' branch's intention
  restrictTo("customer", "restaurant", "admin"), // Keep active as per the 'main' branch's intention
  validateCreateOrder,
  createOrder
);

router.get(
  "/all",
  protect, // Keep active as per the 'main' branch's intention
  restrictTo("customer", "restaurant", "admin"), // Keep active as per the 'main' branch's intention
  getOrderHistory
);

router.post(
  "/:orderId/status",
  protect,
  restrictTo("restaurant", "admin"),
  changeOrderStatus
);

router.post(
  "/:id/feedback",
  protect,
  restrictTo("customer"),
  validateFeedback,
  storeFeedback
);

module.exports = router;