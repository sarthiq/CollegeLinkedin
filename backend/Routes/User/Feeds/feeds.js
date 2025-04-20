const express = require("express");
const router = express.Router();
const { createFeed, updateFeed, deleteFeed, getFeedById, getAllFeeds } = require("../../../Controller/User/Feeds/feeds");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");

router.post("/create",fileHandlerRouter(["image"], 0.5), createFeed);
router.post("/update",fileHandlerRouter(["image"], 0.5), updateFeed);
router.post("/delete", deleteFeed);

router.post("/getFeedById", getFeedById);
router.post("/getAllFeeds", getAllFeeds);






module.exports = router;

