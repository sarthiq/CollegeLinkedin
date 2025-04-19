const express = require("express");
const router = express.Router();
const { createPage, updatePage, deletePage, toggleFollowPage, getAllPages, getPageById } = require("../../../Controller/User/Pages/pages");
const { fileHandlerRouter } = require("../../FileHandler/fileHandler");

router.post("/create",fileHandlerRouter(["image"], 0.5), createPage);
router.post("/update",fileHandlerRouter(["image"], 0.5), updatePage);
router.post("/delete", deletePage);
router.post("/toggleFollow", toggleFollowPage);

router.post("/getAllPages", getAllPages);
router.post("/getPageById", getPageById);






module.exports = router;
