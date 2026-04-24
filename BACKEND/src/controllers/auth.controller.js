import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import Student from "../models/student.model.js"; // ✅ add these imports
import Admin from "../models/admin.model.js";
import Company from "../models/Company.model.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    // ✅ Check if user already exists
    const isUserAlreadyExists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (isUserAlreadyExists) {
      return res.status(409).json({
        message: "User Already Exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    // ✅ Create base user
    const user = await User.create({
      username,
      email,
      password: hash,
      role,
    });

    console.log("✅ User created:", user._id, "Role:", user.role);

    // ✅ Create role-specific profile
    if (role === "student") {
      await Student.create({
        user: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      });
      console.log("✅ Student profile created");
    }
    if (role === "admin") {
      await Admin.create({
        user: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      });
      console.log("✅ Admin profile created");
    }
    if (role === "company") {
      await Company.create({
        user: user._id,
        name: user.username,
        email: user.email,
        role: user.role,
      });
      console.log("✅ Company profile created");
    }

    // ✅ Generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    // ✅ Rollback — delete user if profile creation failed
    if (user?._id) await User.findByIdAndDelete(user._id);
    console.log("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid Email " });
  }

  // Role validation
  if (user.role !== role) {
    return res.status(403).json({
      message: "Please select the correct role",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax", // ✅ FIXED
  });

  res.status(200).json({
    message: "User logged in successfully ",
    user: {
      username: user.username,
      id: user._id,
      role: user.role,
      email: user.email,
    },
  });
};

// GET ALL USERS (for your UI tables)

export default { registerUser, loginUser };
