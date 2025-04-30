const express = require("express");
const router = express.Router();
const { createFeed, updateFeed, deleteFeed, getFeedById, getAllFeeds } = require("../../../Controller/User/Feeds/feeds");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");
const { userAuthentication } = require("../../../Middleware/auth");

router.post("/create",userAuthentication,fileHandlerRouter(["image"], 5), createFeed);
router.post("/update",userAuthentication,fileHandlerRouter(["image"], 5), updateFeed);
router.post("/delete",userAuthentication, deleteFeed);

router.post("/getFeedById", getFeedById);
router.post("/getAllFeeds",userAuthentication, getAllFeeds);






module.exports = router;

