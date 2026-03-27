import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const { email, password, username, role } = req.body;

  const isUserAlreadyExists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "User Already Exists ",
    });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hash,
    role,
  });

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
    secure: false, // ✅ MUST be false in localhost
    sameSite: "lax", // ✅ VERY IMPORTANT
  });

  res.status(201).json({
    message: "user registered successfully ",
    user,
  });
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

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL USERS (for your UI tables)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ userNumber: 1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { registerUser, loginUser, deleteUser, getAllUsers };
