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
  
  // Message functions
  sendMessageToRoom: (roomId, message) => {
    if (socketService.io) {
      socketService.io.to(roomId).emit("new_message", message);
    }
  },

  // File sharing functions
  sendFileToRoom: (roomId, fileData) => {
    if (socketService.io) {
      socketService.io.to(roomId).emit("new_file", fileData);
    }
  },

  // Progress update function
  updateFileProgress: (roomId, fileId, progress) => {
    if (socketService.io) {
      socketService.io.to(roomId).emit("file_progress", { fileId, progress });
    }
  },

  // Get room ID for two users
  getRoomId: (userId1, userId2) => {
    return [userId1, userId2].sort().join('_');
  },

  // Get all rooms for a user
  getUserRooms: (userId) => {
    return socketService.userRooms.get(userId) || new Set();
  }
};

exports.setupSocketIO = (app) => {
    let server;

    if (isProduction) {
      const options = {
        key: fs.readFileSync("/home/epeserver/SSLCertificates/ssl_certificate_key.key"),
        cert: fs.readFileSync("/home/epeserver/SSLCertificates/ssl_certificate.crt"),
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
        
        // Notify user's other devices
        socket.to(`user_${userId}`).emit('user_connected', { userId });
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
      });

      // Handle leaving a chat room
      socket.on("leave-room", (otherUserId) => {
        const roomId = socketService.getRoomId(userId, otherUserId);
        socket.leave(roomId);
        
        // Remove room from user's active rooms
        if (socketService.userRooms.has(userId)) {
          socketService.userRooms.get(userId).delete(roomId);
        }
      });

      // Handle file sharing
      socket.on("start-file-upload", (data) => {
        const { roomId, fileId, fileName, fileSize } = data;
        socket.to(roomId).emit("file-upload-started", { fileId, fileName, fileSize });
      });

      socket.on("file-chunk", (data) => {
        const { roomId, fileId, chunk, progress } = data;
        socket.to(roomId).emit("file-chunk-received", { fileId, chunk });
        socketService.updateFileProgress(roomId, fileId, progress);
      });

      socket.on("file-upload-complete", (data) => {
        const { roomId, fileId, fileUrl } = data;
        socket.to(roomId).emit("file-upload-complete", { fileId, fileUrl });
      });

      // Handle reconnection
      socket.on("reconnect", async () => {
        // Rejoin all previous rooms
        const userRooms = socketService.getUserRooms(userId);
        for (const roomId of userRooms) {
          socket.join(roomId);
        }
        
        // Notify other devices
        socket.to(`user_${userId}`).emit('user_reconnected', { userId });
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        socketService.socketUsers.delete(socket.id);
        // Notify other devices
        socket.to(`user_${userId}`).emit('user_disconnected', { userId });
      });
    });

    return { server, socketService };
};

// Export socketService for use in controllers
exports.socketService = socketService;
