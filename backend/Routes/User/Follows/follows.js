const express = require("express");
const router = express.Router();
const { toggleFollow, getFollowers, getFollowing, checkFollowStatus } = require("../../../Controller/User/Follows/follows");


router.post("/toggleFollow", toggleFollow);
router.post("/getFollowers", getFollowers);
router.post("/getFollowing", getFollowing);
router.post("/checkFollowStatus", checkFollowStatus);

module.exports = router;

