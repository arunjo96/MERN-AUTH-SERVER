import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendMail.js";
import resetPasswordTemplate from "../utils/templates/resetPasswordTemplate.js";
import redisClient from "../config/redis.js";


export const register = async (req, res) => {
  try {
    const { name, email, password, gender, dob, contact, address } =
      req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: "Error",
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      gender,
      dob,
      contact,
      address,
    });

    const token = generateToken({ id: user._id });

    res.status(201).json({
      status: "Success",
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    
    res.status(500).json({
      status: "Error",
      message: error.message || "Server error",
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const key = `login_attempt:${email}`;

    const attempts = await redisClient.get(key);

    if (Number(attempts) >= 3) {
      return res.status(429).json({
        status: "Error",
        message: "Too many login attempts. Please try again after 2 minutes",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      await redisClient.incr(key);

      await redisClient.expire(key, 120);

      return res.status(401).json({
        status: "Error",
        message: "Invalid email or password",
      });
    }

    await redisClient.del(key);

    const token = generateToken({ id: user._id });

    user.password = undefined;

    res.status(200).json({
      status: "Success",
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message || "Server error",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "Error",
        message: "User not found",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        html: resetPasswordTemplate(user.name, resetLink),
      });

    res.status(200).json({
      status: "Success",
      message: "Password reset link sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message || "Server error",
    });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid reset token",
      });
    }

    if (user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({
        status: "Error",
        message: "Reset token has expired",
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      status: "Success",
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message || "Server error",
    });
  }
};


export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-createdAt -updatedAt -__v -email -resetPasswordToken -resetPasswordExpire",
    );

    if (!user) {
      return res.status(404).json({
        status: "Error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "Success",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message || "Server error",
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, gender, dob, contact, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        gender,
        dob,
        contact,
        address,
      },
      {
        new: true,
      },
    ).select("-createdAt -updatedAt -__v -email -resetPasswordToken -resetPasswordExpire");

    if (!updatedUser) {
      return res.status(404).json({
        status: "Error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message || "Server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.token;

    await redisClient.set(`blacklist:${token}`, "revoked", {
      EX: 86400,
    });

    res.status(200).json({
      status: "Success",
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message || "Server error",
    });
  }
};


