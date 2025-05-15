const { JWT_SECRET_KEY } = require("../importantInfo");
const User = require("../Models/User/users");
const jwt = require("jsonwebtoken");

exports.verifyEmailToken = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided, authorization denied"
            });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET_KEY);

        
        req.body.email = decoded.email;
        next();

    } catch (error) {
        res.status(503).json({
            success: false,
            message: "Invalid token",
            error: error.message,
          });
    }
};