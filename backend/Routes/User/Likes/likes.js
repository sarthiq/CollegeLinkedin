const express = require("express");
const router = express.Router();
const { toggleLike, getLikeStatus, getFeedLikes } = require("../../../Controller/User/Likes/likes");

router.post("/toggleLike", toggleLike);
router.post("/getLikeStatus", getLikeStatus);
router.post("/getFeedLikes", getFeedLikes);

module.exports = router;
