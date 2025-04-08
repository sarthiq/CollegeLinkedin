const Admin = require("../../../Models/User/admins");
const { createAdminActivity } = require("../../../Utils/activityUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  AdminTokenExpiresIn,
  JWT_SECRET_KEY,
  NODE_ENV,
} = require("../../../importantInfo");
const { otpStore } = require("../../../Utils/MailService");

exports.adminLogin = async (req, res, next) => {
  const { userName, password } = req.body;

  try {
    if (!userName || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check if the admin exists
    const admin = await Admin.findOne({ where: { userName } });

    if (!admin) {
      return res.status(404).json({ error: "Admin doesn't exist" }); // 404 Not Found
    }
    req.admin = admin;
    // Compare the provided password with the stored hashed password
    bcrypt.compare(password, admin.password, async (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res
          .status(500)
          .json({ error: "Internal server error. Please try again later." });
      }

      if (isMatch) {
        // Generate a JWT token
        const token = jwt.sign(
          { id: admin.id, adminToken: true },
          JWT_SECRET_KEY,
          {
            expiresIn: AdminTokenExpiresIn, // Optional: specify token expiration time
          }
        );
        await createAdminActivity(req, "auth", "Login Successfull");
        return res
          .status(200)
          .json({ status: "Login Successful", token, adminId: admin.id }); // 200 OK
      } else {
        await createAdminActivity(
          req,
          "auth",
          "Login Password verification failed!"
        );
        return res.status(401).json({ error: "Invalid Password" }); // 401 Unauthorized
      }
    });
  } catch (err) {
    console.error("Error during admin login:", err);

    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

exports.adminAuthVerification = async (req, res, next) => {
  try {
    const { authPassword } = req.body;

    if (!authPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the admin exists
    const admin = req.admin;

    if (!admin) {
      return res.status(404).json({ error: "Admin doesn't exist" });
    }

    // Compare the provided authPassword with the stored hashed authPassword
    const isMatch = await bcrypt.compare(authPassword, admin.authPassword);

    if (isMatch) {
      const jwtToken = jwt.sign(
        { id: admin.id, authAuthorized: true },
        JWT_SECRET_KEY,
        {
          expiresIn: AdminTokenExpiresIn,
        }
      );
      await createAdminActivity(req, "auth", "Auth verification successful");
      return res.status(200).json({
        status: "Authentication Successful",
        success: true,
        token: jwtToken,
      });
    } else {
      await createAdminActivity(req, "auth", "Auth verification failed");
      return res.status(401).json({ error: "Invalid Authentication Password" });
    }
  } catch (err) {
    console.error("Error during auth verification:", err);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

exports.resetAuthPassword = async (req, res, next) => {
  let transaction;
  try {
    const { password, newAuthPassword } = req.body;

    if (!password || !newAuthPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the admin exists
    const admin = req.admin;
    // First verify the login password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      await createAdminActivity(
        req,
        "auth",
        "Auth password reset failed - Invalid login password"
      );
      return res.status(401).json({ error: "Invalid login password" });
    }

    // Hash the new auth password
    const hashedAuthPassword = await bcrypt.hash(newAuthPassword, 10);

    // Use transaction to ensure data consistency
    transaction = await sequelize.transaction();

    // Update the auth password
    await admin.update({ authPassword: hashedAuthPassword }, { transaction });

    await createAdminActivity(
      req,
      "auth",
      "Auth password reset successful",
      transaction
    );

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: "Authentication password reset successful",
    });
  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error during auth password reset:", err);
    return res.status(500).json({
      error: "Internal server error. Please try again later.",
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { userName, phone } = req.body;

    if (!userName || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const admin = await Admin.findOne({ where: { userName, phone } });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const resetPasswordToken = jwt.sign(
      { userName: admin.userName },
      JWT_SECRET_KEY,
      {
        expiresIn: "5m",
      }
    );
    return res.status(200).json({ resetPasswordToken, success: true });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

//find a way so that token must be expired after 5 minutes
exports.resetPassword = async (req, res, next) => {
  let transaction;
  try {
    const { resetPasswordToken, password } = req.body;

    if (!resetPasswordToken || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const payload = jwt.verify(resetPasswordToken, JWT_SECRET_KEY);
    const admin = await Admin.findOne({
      where: { userName: payload.userName },
    });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    transaction = await sequelize.transaction();

    await admin.update({ password: hashedPassword }, { transaction });

    await createAdminActivity(
      req,
      "auth",
      "Password reset successful",
      transaction
    );

    await transaction.commit();
    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    if (transaction) {
      await transaction.rollback();
    }
    console.log(err);
    return res
      .status(500)
      .json({ error: "Internal server error. Please try again later." });
  }
};

exports.resendOtp = async (req, res, next) => {
  const { otpAuthenticationToken, otpType } = req.body;

  try {
    if (!otpAuthenticationToken) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Verify the otpAuthenticationToken
    const payload = jwt.verify(otpAuthenticationToken, JWT_SECRET_KEY);
    const { phone } = payload;

    // Check if the phone exists in the otpStore
    if (!otpStore[phone]) {
      return res.status(400).json({ message: "OTP expired or invalid." });
    }

    if (otpStore[phone].count <= 0) {
      return res.status(402).json({ message: "Otp trying limit exceed!" });
    }

    // Generate a new OTP for the phone
    //const newOtp = crypto.randomInt(100000, 999999).toString();
    const newOtp = 123456;
    otpStore[phone] = { otp: newOtp, count: otpStore[phone].count - 1 };

    if (NODE_ENV === "testing") {
      console.log(otpStore);
    }
    // if (otpType === "login") {
    //     sendLoginOtpMessage(phone, newOtp);
    // } else if (otpType === "signUp") {
    //   sendSignUpOtpMessage(phone, newOtp);
    // } else {
    //   return res.status(404).json({ message: "Invalid Otp Type!" });
    // }

    // Refresh OTP expiration time to 5 more minutes
    setTimeout(() => {
      delete otpStore[phone];
    }, 5 * 60 * 1000);

    return res
      .status(200)
      .json({ message: "OTP resent successfully to phone." });
  } catch (err) {
    console.error("Error during OTP resend:", err);
    return res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
  }
};
