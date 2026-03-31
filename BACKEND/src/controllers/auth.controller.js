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

// GET ALL USERS (for your UI tables)

export default { registerUser, loginUser };
