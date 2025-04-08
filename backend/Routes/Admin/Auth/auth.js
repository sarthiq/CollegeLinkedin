const express = require("express");

const authController = require("../../../Controller/Admin/Auth/auth");
const {
  middlewareSendOtp,
  middlewareVerifyOtp,
} = require("../../../Middleware/otpAuthentication");
const { validateAdminDetails } = require("../../../Middleware/validator");
const { adminAuthentication } = require("../../../Middleware/auth");

const router = express.Router();

router.post("/login", authController.adminLogin);

router.post(
  "/forgot-password",
  validateAdminDetails,
  middlewareSendOtp,
  middlewareVerifyOtp,
  authController.forgotPassword
);

router.post("/resend-otp", authController.resendOtp);
router.post("/reset-password", authController.resetPassword);

router.post("/verify-auth",adminAuthentication, authController.adminAuthVerification);
router.post('/reset-auth-password',adminAuthentication, authController.resetAuthPassword);

module.exports = router;
