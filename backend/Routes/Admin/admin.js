const express = require("express");

const authRouter = require("./Auth/auth");
const {
  adminAuthentication,
} = require("../../Middleware/auth");
const activityRouter = require("./Activity/activity");
const userRouter = require("./User/user");
const iqRouter = require("./Iq/iq");
const personalityRouter = require("./Personality/personality");

const router = express.Router();

router.use("/auth", authRouter);
router.use(
  "/activity",
  adminAuthentication,
  activityRouter
);
router.use("/users", adminAuthentication, userRouter);
router.use("/iq", adminAuthentication, iqRouter);
router.use("/personality", adminAuthentication, personalityRouter);
// Admin api routes start here

module.exports = router;
