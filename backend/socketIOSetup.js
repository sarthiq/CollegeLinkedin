const fs = require("fs");
const https = require("https");
const http = require("http");
const socketIO = require("socket.io");

const isProduction = process.env.NODE_ENV === "production";

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
    
    const socketUsers = new Map();
    
    io.on("connection", (socket) => {
      socket.on("join-case", (caseId) => {
        socket.join(caseId);
        socketUsers.set(socket.id, caseId);
      });
    
      socket.on("leave-case", () => {
        const caseId = socketUsers.get(socket.id);
        if (caseId) {
          socket.leave(caseId);
          socketUsers.delete(socket.id);
        }
      });
    
      socket.on("case-info", (info) => {
        io.emit("case-info", info);
      });
    
      socket.on("disconnect", () => {
        const caseId = socketUsers.get(socket.id);
        if (caseId) {
          socketUsers.delete(socket.id);
        }
      });
    });
    
    // Utility functions (export or use directly)
    const sendMessage2Admin = (caseId, message) => {
      io.to(caseId).emit("case-admin-message", message);
    };
    
    const sendMessage2User = (caseId, message) => {
      io.to(caseId).emit("case-user-message", message);
    };
    
    const sendFile2Admin = (caseId, url) => {
      io.to(caseId).emit("case-admin-file", url);
    };
    
    const sendCaseInfo = (info) => {
      io.emit("case-info", info);
    };

    return server;
}
