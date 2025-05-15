const express = require("express");
const router = express.Router();
const authController = require("../../../Controller/User/Auth/auth");
const { verifyEmailToken } = require("../../../Middleware/emailAuthentication");

router.post("/signUp",verifyEmailToken, authController.userSignUp);
router.post("/login", authController.userLogin);
router.post("/forgotPassword",verifyEmailToken, authController.forgotPassword);

module.exports = router;
