const express = require("express");

const authRouter = require("./Auth/auth");
const {
  adminAuthentication,
  SSAAdminAuthentication,
} = require("../../Middleware/auth");
const activityRouter = require("./Activity/activity");
const userRouter = require("./User/user");
const router = express.Router();

router.use("/auth", authRouter);
router.use(
  "/activity",
  adminAuthentication,
  activityRouter
);
router.use("/users", adminAuthentication, userRouter);

// Admin api routes start here

module.exports = router;
