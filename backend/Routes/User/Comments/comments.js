const express = require("express");
const router = express.Router();
const { createComment, updateComment, deleteComment, getFeedComments } = require("../../../Controller/User/Comments/comments");
const { userAuthentication } = require("../../../Middleware/auth");

router.post("/create", userAuthentication, createComment);
router.post("/update", userAuthentication, updateComment);
router.post("/delete", userAuthentication, deleteComment);

router.post("/getFeedComments", getFeedComments);

module.exports = router;

