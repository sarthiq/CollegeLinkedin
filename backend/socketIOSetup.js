const fs = require("fs");
const https = require("https");
const http = require("http");
const socketIO = require("socket.io");

const isProduction = process.env.NODE_ENV === "production";

// Create a socket service object to store io instance and functions
const socketService = {
  io: null,
  socketUsers: new Map(),
  
  // Message functions
  sendMessageToUser: (userId, message) => {
    if (socketService.io) {
      socketService.io.to(`user_${userId}`).emit("new_message", message);
    }
  },

 
  

  sendFileToUser: (userId, fileData) => {
    if (socketService.io) {
      socketService.io.to(`user_${userId}`).emit("new_file", fileData);
    }
  },


  

 
  
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
    
    io.on("connection", (socket) => {
      // Handle user connection
      socket.on("join-user", (userId) => {
        socket.join(`user_${userId}`);
        socketService.socketUsers.set(socket.id, { type: 'user', id: userId });
      });

      
      
      socket.on("disconnect", () => {
        socketService.socketUsers.delete(socket.id);
      });
    });

    return { server, socketService };
};

// Export socketService for use in controllers
exports.socketService = socketService;
