import Admin from "../models/admin.model.js";
import { uploadFile } from "../Services/storage.service.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

async function adminProfile(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You dont have access to use the admin profile " });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Profile image is required" });
    }
    const { name, gender, branch, mobile, email } = req.body;

    const result = await uploadFile(file.buffer.toString("base64"));

    const admin = await Admin.create({
      profilepic: result.url,
      user: decoded.id,
      name,
      gender,
      branch,
      mobile,
      email: email || user.email,
    });

    return res.status(201).json({
      message: "Admin profile Created successfully ",
      admin: {
        id: admin._id,
        profilepic: admin.profilepic,
        user: admin.user,
        name: admin.name,
        gender: admin.gender,
        branch: admin.branch,
        mobile: admin.mobile,
        email: admin.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate data not allowed",
      });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
}

export default { adminProfile };
