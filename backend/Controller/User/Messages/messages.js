const Message = require("../../../Models/Relationships/messages");
const User = require("../../../Models/User/users");
const UserProfile = require("../../../Models/User/userProfile");
const { Op } = require("sequelize");
const { sequelize } = require("../../../importantInfo");

// Send a message
exports.sendMessage = async (req, res) => {
  let transaction;
  try {
    const { receiverId, message,type="text" } = req.body;
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
    if (receiverId == senderId) {
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
        type,
      },
      { transaction }
    );

    await transaction.commit();

    // Get sender details for socket message
    const sender = await User.findByPk(senderId, {
      attributes: ['id', 'name'],
      include: [
        {
          model: UserProfile,
          attributes: ['profileUrl'],
        },
      ],
    });

    // Prepare message data for socket
    const messageData = {
      ...newMessage.toJSON(),
      sender: sender,
    };

    // Get room ID for the two users
    const roomId = global.socketService.getRoomId(senderId, receiverId);
    
    // Send real-time message using socket
    global.socketService.sendMessageToRoom(roomId, messageData);

    // Send direct message notification to receiver if they're online
    const notificationData = {
      type: 'new_message_notification',
      message: {
        id: newMessage.id,
        message: message,
        type: type,
        createdAt: newMessage.createdAt,
        sender: sender
      },
      roomId: roomId
    };
    global.socketService.sendDirectMessage(receiverId, notificationData);

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

    const { count, rows: messageRecords } = await Message.findAndCountAll({
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

    // Fetch associated users and their profiles for each message
    const messages = await Promise.all(messageRecords.map(async (message) => {
      const [sender, receiver] = await Promise.all([
        User.findByPk(message.senderId, {
          attributes: ['id', 'name'],
          include: [{
            model: UserProfile,
            attributes: ['profileUrl'],
          }],
        }),
        User.findByPk(message.receiverId, {
          attributes: ['id', 'name'],
          include: [{
            model: UserProfile,
            attributes: ['profileUrl'],
          }],
        }),
      ]);

      return {
        ...message.toJSON(),
        sender: sender.toJSON(),
        receiver: receiver.toJSON(),
      };
    }));

    const totalPages = Math.ceil(count / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          total: count,
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
    const { page = 1, limit = 10, unreadMessage = false } = req.body;
    const offset = (page - 1) * limit;

    // First get the last message for each conversation using a subquery
    const lastMessages = await Message.findAll({
      attributes: [
        'id',
        'senderId',
        'receiverId',
        'message',
        'isRead',
        'createdAt'
      ],
      where: {
        id: {
          [Op.in]: sequelize.literal(`(
            SELECT MAX(id) 
            FROM messages 
            WHERE (senderId = ${currentUserId} OR receiverId = ${currentUserId})
            ${unreadMessage ? `AND receiverId = ${currentUserId} AND isRead = false` : ''}
            GROUP BY CASE 
              WHEN senderId = ${currentUserId} THEN receiverId 
              ELSE senderId 
            END
          )`)
        }
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get total count for pagination
    const totalCount = await Message.count({
      where: {
        id: {
          [Op.in]: sequelize.literal(`(
            SELECT MAX(id) 
            FROM messages 
            WHERE (senderId = ${currentUserId} OR receiverId = ${currentUserId})
            ${unreadMessage ? `AND receiverId = ${currentUserId} AND isRead = false` : ''}
            GROUP BY CASE 
              WHEN senderId = ${currentUserId} THEN receiverId 
              ELSE senderId 
            END
          )`)
        }
      }
    });

    // Fetch associated users and their profiles for each conversation
    const conversations = await Promise.all(lastMessages.map(async (message) => {
      const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId;
      
      // Get user details
      const user = await User.findByPk(otherUserId, {
        attributes: ['id', 'name'],
        include: [{
          model: UserProfile,
          attributes: ['profileUrl']
        }]
      });

      // Get unread count for this conversation
      const unreadCount = await Message.count({
        where: {
          senderId: otherUserId,
          receiverId: currentUserId,
          isRead: false
        }
      });

      return {
        lastMessage: {
          id: message.id,
          message: message.message,
          isRead: message.isRead,
          createdAt: message.createdAt,
          senderId: message.senderId,
          receiverId: message.receiverId
        },
        user: user.toJSON(),
        unreadCount
      };
    }));

    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        conversations,
        pagination: {
          total: totalCount,
          totalPages,
          currentPage: parseInt(page),
          limit: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
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
        senderId: currentUserId,
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

exports.getUserInfo = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const user = await User.findByPk(userId, {
      attributes: ['id', 'name'],
      include: [{
        model: UserProfile,
        attributes: ['profileUrl']
      }]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
