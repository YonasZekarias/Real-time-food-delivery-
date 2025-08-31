const express = require("express");
const validate = require("../middlewares/validate");
const {
  registerUserSchema,
  loginSchema,
  otpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validators/userValidator");

const {
  register,
  login,
  verifyOTP,
  refreshToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");

const router = express.Router();
router.post("/register", validate(registerUserSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/verify-otp", validate(otpSchema), verifyOTP);
router.get("/refresh-token", refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
module.exports = router;
