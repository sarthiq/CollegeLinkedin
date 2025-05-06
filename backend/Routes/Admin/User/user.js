


const express = require("express");
const { getUserById, getUsers, getUsersStats, updateUserDetails, getDailyActiveUsers, getDailyActiveUsersStats, getUserActivityStats } = require("../../../Controller/Admin/Users/users");

const router = express.Router();

router.post("/getUserById", getUserById);
router.post("/getUsers", getUsers);
router.post("/getUsersStats", getUsersStats);
router.post("/updateUserDetails", updateUserDetails);
router.post("/getDailyActiveUsers", getDailyActiveUsers);
router.post("/getDailyActiveUsersStats", getDailyActiveUsersStats);
router.post("/getUserActivityStats", getUserActivityStats);


module.exports = router;
