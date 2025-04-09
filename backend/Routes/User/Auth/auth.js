const express = require("express");
const router = express.Router();
const authController = require("../../../Controller/User/Auth/auth");

router.post("/signup", authController.userSignUp);
router.post("/login", authController.userLogin);

module.exports = router;
