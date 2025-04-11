const express = require("express");
const router = express.Router();
const { createPage, updatePage, deletePage, toggleFollowPage, getAllPages, getPageById } = require("../../../Controller/User/Pages/pages");

router.post("/create", createPage);
router.post("/update", updatePage);
router.post("/delete", deletePage);
router.post("/toggleFollow", toggleFollowPage);

router.post("/getAllPages", getAllPages);
router.post("/getPageById", getPageById);






module.exports = router;
