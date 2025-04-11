const express = require("express");
const router = express.Router();
const { createComment, updateComment, deleteComment, getFeedComments } = require("../../../Controller/User/Comments/comments");

router.post("/create", createComment);
router.post("/update", updateComment);
router.post("/delete", deleteComment);

router.post("/getFeedComments", getFeedComments);

module.exports = router;

