const { JWT_SECRET_KEY, NODE_ENV } = require("../../importantInfo");
const User = require("../../Models/User/users");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { emailOtpStore, sendOtpEmail } = require("../../Utils/emailUtils");
const { Op } = require("sequelize");

exports.sendOtp = async (req, res) => {
  const { email, type = "signup", phone } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      where: phone
        ? {
            [Op.or]: [{ email }, { phone }],
          }
        : { email },
    });

    if (type !== "signup") {
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found with this email!",
        });
      }
    } else {
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email/phone!",
        });
      }
    }

    const emailOtp = crypto.randomInt(100000, 999999).toString();

    emailOtpStore[email] = { otp: emailOtp, count: 4 };

    setTimeout(() => {
      delete emailOtpStore[email];
    }, 4 * 60 * 1000);

    if (NODE_ENV === "testing") {
      console.log(emailOtpStore);
    }

    sendOtpEmail(email, emailOtp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

exports.verifyEmailOtp = async (req, res, next) => {
  const { email, phone, otp, type = "signup" } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const user = await User.findOne({
    where: phone
      ? {
          [Op.or]: [{ email }, { phone }],
        }
      : { email },
  });

  if (type !== "signup") {
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found with this email!",
      });
    }
  } else {
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email/phone!",
      });
    }
  }

  // Verify OTP
  if (!emailOtpStore[email]) {
    return res.status(400).json({
      success: false,
      message: "OTP has expired or is invalid",
    });
  }

  if (emailOtpStore[email].count <= 0) {
    return res.status(400).json({
      success: false,
      message: "OTP attempt limit exceeded",
    });
  }

  if (emailOtpStore[email].otp !== otp) {
    emailOtpStore[email].count -= 1;
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  // Delete OTP after successful verification
  delete emailOtpStore[email];

  // Generate JWT token
  const token = jwt.sign({ email }, JWT_SECRET_KEY, {
    expiresIn: "5m",
  });

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    token,
  });
};
