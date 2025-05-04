const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getConversation,
  getAllConversations,
  markAsRead,
  deleteMessage,
  getUserInfo,
} = require("../../../Controller/User/Messages/messages");

router.post("/sendMessage", sendMessage);
router.post("/getConversation", getConversation);
router.post("/getAllConversations", getAllConversations);
router.post("/markAsRead", markAsRead);
router.post("/deleteMessage", deleteMessage);
router.post("/getUserInfo", getUserInfo);

module.exports = router;
