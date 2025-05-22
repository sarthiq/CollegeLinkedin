const express = require("express");
const router = express.Router();
const {
  getAllCommunities,
  getCommunityById,   
  toggleFollowCommunity,
  getCommunityFeeds,
  getFollowedCommunitiesFeeds,
  createFeed,
  deleteFeed,
  updateFeed,
} = require("../../../Controller/User/Community/community");
const { userAuthentication } = require("../../../Middleware/auth");


router.post("/getAll",userAuthentication, getAllCommunities);
router.post("/getById", userAuthentication, getCommunityById);
router.post("/toggleFollow", userAuthentication, toggleFollowCommunity);
router.post("/getFeeds", userAuthentication, getCommunityFeeds);
router.post("/getFollowedCommunitiesFeeds", userAuthentication, getFollowedCommunitiesFeeds);
router.post("/createFeed", userAuthentication, createFeed);
router.post("/deleteFeed", userAuthentication, deleteFeed);
router.post("/updateFeed", userAuthentication, updateFeed); 

module.exports = router;



