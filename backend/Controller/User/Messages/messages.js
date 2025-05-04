const Message = require("../../../Models/Relationships/messages");
const User = require("../../../Models/User/users");
const UserProfile = require("../../../Models/User/userProfile");
const { Op } = require("sequelize");
const { sequelize } = require("../../../importantInfo");

// Send a message
exports.sendMessage = async (req, res) => {
  let transaction;
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID and message are required",
      });
    }

    // Check if receiver exists
    const receiver = await User.findByPk(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found",
      });
    }

    // Prevent self-messaging
    if (receiverId === senderId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send message to yourself",
      });
    }

    transaction = await sequelize.transaction();

    const newMessage = await Message.create(
      {
        senderId,
        receiverId,
        message,
        isRead: false,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      data: newMessage,
      message: "Message sent successfully",
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get conversation between two users
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const currentUserId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const { page = 1, limit = 20 } = req.body;
    const offset = (page - 1) * limit;

    const messages = await Message.findAndCountAll({
      where: {
        [Op.or]: [
          {
            senderId: currentUserId,
            receiverId: userId,
          },
          {
            senderId: userId,
            receiverId: currentUserId,
          },
        ],
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name'],
          include: [
            {
              model: UserProfile,
              attributes: ['profileUrl'],
            },
          ],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name'],
          include: [
            {
              model: UserProfile,
              attributes: ['profileUrl'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Mark unread messages as read
    await Message.update(
      { isRead: true },
      {
        where: {
          senderId: userId,
          receiverId: currentUserId,
          isRead: false,
        },
      }
    );

    const totalPages = Math.ceil(messages.count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        messages: messages.rows,
        pagination: {
          total: messages.count,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all conversations for current user
exports.getAllConversations = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;

    // Get unique users who have conversations with current user
    const conversations = await Message.findAll({
      attributes: [
        'senderId',
        'receiverId',
        [sequelize.fn('MAX', sequelize.col('createdAt')), 'lastMessageTime'],
      ],
      where: {
        [Op.or]: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
      },
      group: [
        sequelize.literal('CASE WHEN senderId = ' + currentUserId + ' THEN receiverId ELSE senderId END'),
      ],
      order: [[sequelize.literal('lastMessageTime'), 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // Get user details and last message for each conversation
    const conversationDetails = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.senderId === currentUserId ? conv.receiverId : conv.senderId;
        const otherUser = await User.findByPk(otherUserId, {
          attributes: ['id', 'name'],
          include: [
            {
              model: UserProfile,
              attributes: ['profileUrl'],
            },
          ],
        });

        const lastMessage = await Message.findOne({
          where: {
            [Op.or]: [
              {
                senderId: currentUserId,
                receiverId: otherUserId,
              },
              {
                senderId: otherUserId,
                receiverId: currentUserId,
              },
            ],
          },
          order: [['createdAt', 'DESC']],
        });

        const unreadCount = await Message.count({
          where: {
            senderId: otherUserId,
            receiverId: currentUserId,
            isRead: false,
          },
        });

        return {
          user: otherUser,
          lastMessage,
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        conversations: conversationDetails,
        pagination: {
          currentPage: parseInt(page),
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  let transaction;
  try {
    const { messageIds } = req.body;
    const currentUserId = req.user.id;

    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({
        success: false,
        message: "Message IDs array is required",
      });
    }

    transaction = await sequelize.transaction();

    await Message.update(
      { isRead: true },
      {
        where: {
          id: {
            [Op.in]: messageIds,
          },
          receiverId: currentUserId,
        },
        transaction,
      }
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Messages marked as read successfully",
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  let transaction;
  try {
    const { messageId } = req.body;
    const currentUserId = req.user.id;

    if (!messageId) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required",
      });
    }

    const message = await Message.findOne({
      where: {
        id: messageId,
        [Op.or]: [
          { senderId: currentUserId },
          { receiverId: currentUserId },
        ],
      },
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found or unauthorized",
      });
    }

    transaction = await sequelize.transaction();

    await message.destroy({ transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
