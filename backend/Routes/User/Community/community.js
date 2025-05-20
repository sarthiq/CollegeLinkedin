const express = require("express");
const router = express.Router();
const {
  getAllCommunities,
  toggleFollowCommunity,
} = require("../../../Controller/User/Community/community");


router.post("/getAll", getAllCommunities);
router.post("/toggleFollow", userAuthentication, toggleFollowCommunity);

module.exports = router;



