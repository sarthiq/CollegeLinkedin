const fs = require("fs");
const https = require("https");
const http = require("http");
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("./importantInfo");
const User = require("./Models/User/users");
const Message = require("./Models/Relationships/messages");
const { Op } = require("sequelize");

const isProduction = process.env.NODE_ENV === "production";

// Create a socket service object to store io instance and functions
const socketService = {
  io: null,
  socketUsers: new Map(),
  userRooms: new Map(), // Map to store user's active rooms
  userSockets: new Map(), // Map to store all socket IDs for each user
  userStatus: new Map(), // Map to store user online status
  typingUsers: new Map(), // Map to store typing status for each room
  messagesPageUsers: new Set(), // Set to store users who are on messages page
  
  // Message functions
  sendMessageToRoom: (roomId, message) => {
    if (socketService.io) {
      socketService.io.to(roomId).emit("new_message", message);
    }
  },

  // Send direct message to user
  sendDirectMessage: (userId, message) => {
    if (socketService.io) {
      const userSockets = socketService.userSockets.get(userId);
      if (userSockets && userSockets.size > 0) {
        // Send to all user's connected devices
        userSockets.forEach(socketId => {
          socketService.io.to(socketId).emit("direct_message", message);
        });
      }
    }
  },

  // Send message read status
  sendMessageReadStatus: (roomId, userId, messageIds) => {
    if (socketService.io) {
      socketService.io.to(roomId).emit("messages_read", {
        userId,
        messageIds,
        timestamp: new Date()
      });
    }
  },

  // Get typing status for a room
  getTypingStatus: (roomId) => {
    return socketService.typingUsers.get(roomId) || new Set();
  },

  // Get all typing statuses for a user
  getAllTypingStatuses: (userId) => {
    const allTypingStatuses = new Map();
    socketService.typingUsers.forEach((typingUsers, roomId) => {
      if (typingUsers.size > 0) {
        allTypingStatuses.set(roomId, Array.from(typingUsers));
      }
    });
    return allTypingStatuses;
  },

  // Broadcast user status to all connected users
  broadcastUserStatus: async (userId, status) => {
    if (socketService.io) {
      // Update user status
      socketService.userStatus.set(userId, status);

     

      const chatUsers = await Message.findAll({
        attributes: ['senderId', 'receiverId'],
        where: {
          [Op.or]: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        raw: true
      });

      // Get unique user IDs who have chatted with this user
      const uniqueUserIds = new Set();
      chatUsers.forEach(chat => {
        if (chat.senderId !== userId) uniqueUserIds.add(chat.senderId);
        if (chat.receiverId !== userId) uniqueUserIds.add(chat.receiverId);
      });

      // Broadcast status to all relevant users
      uniqueUserIds.forEach(targetUserId => {
        const userSockets = socketService.getUserSockets(targetUserId);
        if (userSockets && userSockets.size > 0) {
          userSockets.forEach(socketId => {
            socketService.io.to(socketId).emit("user_status_change", {
              userId,
              status,
              timestamp: new Date()
            });
          });
        }
      });
    }
  },

  // Get room ID for two users
  getRoomId: (userId1, userId2) => {
    return [userId1, userId2].sort().join('_');
  },

  // Get all rooms for a user
  getUserRooms: (userId) => {
    return socketService.userRooms.get(userId) || new Set();
  },

  // Get all socket IDs for a user
  getUserSockets: (userId) => {
    return socketService.userSockets.get(userId) || new Set();
  },

  // Get user's online status
  getUserStatus: (userId) => {
    return socketService.userStatus.get(userId) || 'offline';
  }
};

//ssl_certificate /etc/nginx/ssl/sarthiq.com.crt;
//ssl_certificate_key /etc/nginx/ssl/sarthiq.com.key;

exports.setupSocketIO = (app) => {
    let server;

    if (isProduction) {
      const options = {
        key: fs.readFileSync("/etc/nginx/ssl/sarthiq.com.key"),
        cert: fs.readFileSync("/etc/nginx/ssl/sarthiq.com.crt"),
      };
      server = https.createServer(options, app);
    } else {
      server = http.createServer(app);
    }
    
    const io = socketIO(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    // Store io instance in socketService
    socketService.io = io;
    
    // Middleware for authentication
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const user = await User.findByPk(decoded.id);

        if (!user) {
          return next(new Error('User not found'));
        }

        if (user.isBlocked) {
          return next(new Error('User is blocked'));
        }

        socket.user = user;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    io.on("connection", (socket) => {
      const userId = socket.user.id;
      
      // Handle user connection
      socket.on("join-user", async () => {
        // Store socket in user's room
        socket.join(`user_${userId}`);
        socketService.socketUsers.set(socket.id, { type: 'user', id: userId });
        
        // Add socket to user's socket collection
        if (!socketService.userSockets.has(userId)) {
          socketService.userSockets.set(userId, new Set());
        }
        socketService.userSockets.get(userId).add(socket.id);
        
        // Set user as online and broadcast status
        await socketService.broadcastUserStatus(userId, 'online');
        
        // Notify user's other devices
        socket.to(`user_${userId}`).emit('user_connected', { 
          userId,
          activeDevices: socketService.userSockets.get(userId).size
        });
      });

      // Handle message read status
      socket.on("mark_messages_read", async (data) => {
        const { messageIds, otherUserId } = data;
        const roomId = socketService.getRoomId(userId, otherUserId);
        
        // Send read status through socket
        socketService.sendMessageReadStatus(roomId, userId, messageIds);
      });

      // Handle entering messages page
      socket.on("enter_messages_page", async () => {
        // Join messages page room
        socket.join(`messages_page_${userId}`);
        socketService.messagesPageUsers.add(userId);

        // Get all conversations for this user
        const Message = require("./Models/Relationships/messages");
        const { Op } = require("sequelize");

        const conversations = await Message.findAll({
          attributes: ['senderId', 'receiverId'],
          where: {
            [Op.or]: [
              { senderId: userId },
              { receiverId: userId }
            ]
          },
          raw: true
        });

        // Get unique user IDs who have chatted with this user
        const uniqueUserIds = new Set();
        conversations.forEach(chat => {
          if (chat.senderId !== userId) uniqueUserIds.add(chat.senderId);
          if (chat.receiverId !== userId) uniqueUserIds.add(chat.receiverId);
        });

        // Send current typing status for all conversations
        uniqueUserIds.forEach(otherUserId => {
          const roomId = socketService.getRoomId(userId, otherUserId);
          const typingUsers = socketService.getTypingStatus(roomId);
          if (typingUsers.size > 0) {
            socket.emit("typing_status", {
              roomId,
              typingUsers: Array.from(typingUsers),
              timestamp: new Date()
            });
          }
        });
      });

      // Handle leaving messages page
      socket.on("leave_messages_page", () => {
        socket.leave(`messages_page_${userId}`);
        socketService.messagesPageUsers.delete(userId);
      });

      // Handle typing status
      socket.on("typing", (data) => {
        const { otherUserId, isTyping } = data;
        const roomId = socketService.getRoomId(userId, otherUserId);
        
        // Update typing status
        if (!socketService.typingUsers.has(roomId)) {
          socketService.typingUsers.set(roomId, new Set());
        }

        if (isTyping) {
          socketService.typingUsers.get(roomId).add(userId);
        } else {
          socketService.typingUsers.get(roomId).delete(userId);
          // Clean up empty sets
          if (socketService.typingUsers.get(roomId).size === 0) {
            socketService.typingUsers.delete(roomId);
          }
        }

        // Broadcast typing status to room and messages page
        const typingData = {
          roomId,
          userId,
          isTyping,
          timestamp: new Date()
        };

        // Send to room
        socket.to(roomId).emit("typing_status", typingData);

        // Send to other user's messages page if they're on it
        if (socketService.messagesPageUsers.has(otherUserId)) {
          socket.to(`messages_page_${otherUserId}`).emit("typing_status", typingData);
        }
      });

      // Handle joining a chat room
      socket.on("join-room", (otherUserId) => {
        const roomId = socketService.getRoomId(userId, otherUserId);
        socket.join(roomId);
        
        // Store room in user's active rooms
        if (!socketService.userRooms.has(userId)) {
          socketService.userRooms.set(userId, new Set());
        }
        socketService.userRooms.get(userId).add(roomId);

        // Get current typing status for the room
        const typingUsers = socketService.getTypingStatus(roomId);
        if (typingUsers.size > 0) {
          socket.emit("typing_status", {
            roomId,
            typingUsers: Array.from(typingUsers),
            timestamp: new Date()
          });
        }

        // Notify other user if they're online
        const otherUserSockets = socketService.getUserSockets(otherUserId);
        if (otherUserSockets.size > 0) {
          socket.to(otherUserId).emit('user_joined_room', {
            roomId,
            userId
          });
        }
      });

      // Handle leaving a chat room
      socket.on("leave-room", (otherUserId) => {
        const roomId = socketService.getRoomId(userId, otherUserId);
        socket.leave(roomId);
        
        // Remove room from user's active rooms
        if (socketService.userRooms.has(userId)) {
          socketService.userRooms.get(userId).delete(roomId);
        }

        // Clear typing status when leaving room
        if (socketService.typingUsers.has(roomId)) {
          socketService.typingUsers.get(roomId).delete(userId);
          if (socketService.typingUsers.get(roomId).size === 0) {
            socketService.typingUsers.delete(roomId);
          }
          // Broadcast typing stopped
          socket.to(roomId).emit("typing_status", {
            roomId,
            userId,
            isTyping: false,
            timestamp: new Date()
          });
        }

        // Notify other user if they're online
        const otherUserSockets = socketService.getUserSockets(otherUserId);
        if (otherUserSockets.size > 0) {
          socket.to(otherUserId).emit('user_left_room', {
            roomId,
            userId
          });
        }
      });

      // Handle reconnection
      socket.on("reconnect", async () => {
        // Rejoin all previous rooms
        const userRooms = socketService.getUserRooms(userId);
        for (const roomId of userRooms) {
          socket.join(roomId);
        }
        
        // Notify other devices
        socket.to(`user_${userId}`).emit('user_reconnected', { 
          userId,
          activeDevices: socketService.userSockets.get(userId).size
        });
      });

      // Handle disconnection
      socket.on("disconnect", async () => {
        socketService.socketUsers.delete(socket.id);
        
        // Remove socket from user's socket collection
        if (socketService.userSockets.has(userId)) {
          socketService.userSockets.get(userId).delete(socket.id);
          
          // If this was the last socket, update status to offline
          if (socketService.userSockets.get(userId).size === 0) {
            socketService.userSockets.delete(userId);
            await socketService.broadcastUserStatus(userId, 'offline');
          }
        }
        
        // Notify other devices
        socket.to(`user_${userId}`).emit('user_disconnected', { 
          userId,
          activeDevices: socketService.userSockets.has(userId) ? 
            socketService.userSockets.get(userId).size : 0
        });
      });
    });

    return { server, socketService };
};

// Export socketService for use in controllers
exports.socketService = socketService;
