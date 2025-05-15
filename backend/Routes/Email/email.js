const express = require("express");
const router = express.Router();

const { sendOtp, verifyEmailOtp } = require("../../Controller/Email/email");

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyEmailOtp);

module.exports = router;
