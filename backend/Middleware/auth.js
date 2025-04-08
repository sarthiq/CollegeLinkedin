const jwt = require("jsonwebtoken");
const Admin = require("../Models/User/admins");
const { JWT_SECRET_KEY, DEVELOPER_USERNAME } = require("../importantInfo");

exports.adminAuthentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    // Verify the JWT token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET_KEY);

    if(!payload.adminToken){
      return res.status(403).json({ error: "Invalid admin token!=" });
    }

    // Find the admin by primary key (id)
    const admin = await Admin.findByPk(payload.id);

    // Check if the admin exists
    if (!admin) {
      return res.status(404).json({ error: "Admin not found!" });
    }

    // Check freeze status for admin types 'SA' and 'A'
    if (
      (admin.adminType === "SA" || admin.adminType === "A") &&
      admin.isDeactivated
    ) {
      return res
        .status(403)
        .json({ error: "Access denied. Admin account is Deactivated!" });
    }

    // Check freeze status for admin types 'SA' and 'A'
    if (
      (admin.adminType === "SA" || admin.adminType === "A") &&
      admin.freezeStatus
    ) {
      return res
        .status(403)
        .json({ error: "Access denied. Admin account is frozen!" });
    }

    // Assign the admin object to the request object
    req.admin = admin;

    // Proceed to the next middleware
    next();
  } catch (err) {
    
    return res.status(503).json({ error: "Invalid Signature!" });
  }
};

exports.adminAuthAuthentication = async (req, res, next) => {
  try {
    const token = req.headers.authauthorization;
    //console.log(req.headers);

    // Verify the JWT token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET_KEY);

    if (req.admin.id !== payload.id) {
      return res.status(403).json({ error: "Invalid auth token!-" });
    }
    // Check if the token has the authAuthorized flag
    if (!payload.authAuthorized) {
      return res.status(403).json({ error: "Auth verification required!" });
    }

    // Proceed to the next middleware
    next();
  } catch (err) {
    //console.log(err);
    return res.status(503).json({ error: "Invalid Signature!" });
  }
};

exports.SSAAdminAuthentication = async (req, res, next) => {
  const admin = req.admin;

  if (admin.adminType !== "SSA") {
    return res.status(403).json({
      message: "Invalid Request! - ex00-ssa",
      success: false,
    });
  }

  next();
};

exports.developerAuthentication = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    // Verify the JWT token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET_KEY);

    // Check if the username matches the developer username
    if (payload.username !== DEVELOPER_USERNAME) {
      return res.status(403).json({ error: "Invalid developer token!" });
    }

    // Add developer info to request object
    req.developer = {
      username: payload.username
    };

    // Proceed to the next middleware
    next();
  } catch (err) {
    return res.status(503).json({ error: "Invalid Signature!" });
  }
};

