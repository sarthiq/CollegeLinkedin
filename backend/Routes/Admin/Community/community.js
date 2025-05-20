const express = require("express");
const router = express.Router();
const {
  createCommunity,
  updateCommunity,
  getAllCommunities,
  getCommunityById,
  createCommunityFeed,
  updateCommunityFeed,
  getAllCommunityFeeds,
  getCommunityFeedById,
  deleteCommunityFeed,
} = require("../../../Controller/Admin/Community/community");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");


router.post("/create",fileHandlerRouter(["image"], 5), createCommunity);
router.post("/update",fileHandlerRouter(["image"], 5), updateCommunity);
router.post("/getAll", getAllCommunities);
router.post("/getById", getCommunityById);
router.post("/createFeed",fileHandlerRouter(["image"], 5), createCommunityFeed);
router.post("/updateFeed",fileHandlerRouter(["image"], 5), updateCommunityFeed);
router.post("/getAllFeeds", getAllCommunityFeeds);
router.post("/getByIdFeed", getCommunityFeedById);
router.post("/deleteFeed", deleteCommunityFeed);



module.exports = router;
