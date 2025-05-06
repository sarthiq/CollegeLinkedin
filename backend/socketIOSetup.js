const fs = require("fs");
const https = require("https");
const http = require("http");
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("./importantInfo");
const User = require("./Models/User/users");

const isProduction = process.env.NODE_ENV === "production";

// Create a socket service object to store io instance and functions
const socketService = {
  io: null,
  socketUsers: new Map(),
  userRooms: new Map(), // Map to store user's active rooms
  userSockets: new Map(), // Map to store all socket IDs for each user
  
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
        
        // Notify user's other devices
        socket.to(`user_${userId}`).emit('user_connected', { 
          userId,
          activeDevices: socketService.userSockets.get(userId).size
        });
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

        // Notify other user if they're online
        const otherUserSockets = socketService.getUserSockets(otherUserId);
        if (otherUserSockets.size > 0) {
          socketService.io.to(otherUserId).emit('user_joined_room', {
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

        // Notify other user if they're online
        const otherUserSockets = socketService.getUserSockets(otherUserId);
        if (otherUserSockets.size > 0) {
          socketService.io.to(otherUserId).emit('user_left_room', {
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
      socket.on("disconnect", () => {
        socketService.socketUsers.delete(socket.id);
        
        // Remove socket from user's socket collection
        if (socketService.userSockets.has(userId)) {
          socketService.userSockets.get(userId).delete(socket.id);
          
          // If this was the last socket, clean up the Set
          if (socketService.userSockets.get(userId).size === 0) {
            socketService.userSockets.delete(userId);
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
