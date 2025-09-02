const express = require("express");
const { getUserFeedback, userInfo } = require("../controllers/user.controller");
const protect = require("../middlewares/auth.middleware");
const restrictTo = require("../middlewares/restrictTo");

const router = express.Router();

router.get('/info', protect, userInfo);
router.get("/:id/feedback", protect, restrictTo("Customer"), getUserFeedback);

module.exports = router;
