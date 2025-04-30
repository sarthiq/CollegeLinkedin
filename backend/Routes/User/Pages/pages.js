const express = require("express");
const router = express.Router();
const { createPage, updatePage, deletePage, toggleFollowPage, getAllPages, getPageById } = require("../../../Controller/User/Pages/pages");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");
const { userAuthentication, unauthorizedUserAuthentication } = require("../../../Middleware/auth");


router.post("/create",userAuthentication,fileHandlerRouter(["image"], 5), createPage);
router.post("/update",userAuthentication,fileHandlerRouter(["image"], 5), updatePage);
router.post("/delete",userAuthentication, deletePage);
router.post("/toggleFollow",userAuthentication, toggleFollowPage);

router.post("/getAllPages",userAuthentication, getAllPages);
router.post("/getPageById",unauthorizedUserAuthentication, getPageById);






module.exports = router;
