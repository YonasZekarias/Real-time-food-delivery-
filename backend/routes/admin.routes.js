const express = require("express");
const {
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
} = require("../controllers/admin.controller");
const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/restrictTo");

const router = express.Router();

router.get("/users", protect, restrictTo("admin"), getAllUsers);
router.post("/users/roles", protect, restrictTo("admin"), getUserByRoles);
router.get("/restaurants/pending", protect, restrictTo("admin"), pendingRestaurant);
router.patch("/restaurants/:id/verify", protect, restrictTo("admin"), verifyRestaurant);
router.patch("/restaurants/:id/reject", protect, restrictTo("admin"), rejectRestaurant);
router.get("/restaurants", protect, restrictTo("admin"), getAllRestaurants);
router.get("/stats", protect, restrictTo("admin"), getPlatformStats);
router.patch("/users/:id/suspend", protect, restrictTo("admin"), suspendUser);
router.get("/orders/complaints", protect, restrictTo("admin"), getComplaints);
router.patch(
  "/orders/:id/resolve",
  protect,
  restrictTo("admin"),
  resolveComplaint
);

module.exports = router;
