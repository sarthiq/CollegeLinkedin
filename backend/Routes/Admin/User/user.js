


const express = require("express");
const { getUserById, getUsers, getUsersStats, updateUserDetails } = require("../../../Controller/Admin/Users/users");

const router = express.Router();

router.post("/getUserById", getUserById);
router.post("/getUsers", getUsers);
router.post("/getUsersStats", getUsersStats);
router.post("/updateUserDetails", updateUserDetails);



module.exports = router;
