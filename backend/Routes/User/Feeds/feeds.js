const express = require("express");
const router = express.Router();
const { createFeed, updateFeed, deleteFeed, getFeedById, getAllFeeds } = require("../../../Controller/User/Feeds/feeds");

router.post("/create", createFeed);
router.post("/update", updateFeed);
router.post("/delete", deleteFeed);

router.post("/getFeedById", getFeedById);
router.post("/getAllFeeds", getAllFeeds);






module.exports = router;

