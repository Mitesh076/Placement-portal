import Admin from "../models/admin.model.js";
import { uploadFile } from "../Services/admin.storage.service.js";
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

    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingAdmin) {
      if (existingAdmin.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }

      if (existingAdmin.mobile === mobile) {
        return res
          .status(400)
          .json({ message: "Mobile number already exists" });
      }
    }

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

export const updateAdminProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findOne({ user: decoded.id });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { name, gender, branch, mobile, email } = req.body;
    const file = req.file;

    // ✅ keep old image by default
    let imageUrl = admin.profilepic;

    // ✅ update only if new image uploaded
    if (file) {
      const result = await uploadFile(file.buffer.toString("base64"));
      imageUrl = result;
    }

    admin.name = name || admin.name;
    admin.gender = gender || admin.gender;
    admin.branch = branch || admin.branch;
    admin.mobile = mobile || admin.mobile;
    admin.email = email || admin.email;
    admin.profilepic = imageUrl;

    await admin.save();

    res.json({
      message: "Profile updated",
      admin,
    });
  } catch (error) {
    console.log("UPDATE ERROR:", error); // 👈 IMPORTANT
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findOne({ user: decoded.id });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const result = await uploadFile(req.file.buffer.toString("base64"));

    // ✅ update only image
    admin.profilepic = result.url;

    await admin.save();

    res.json({
      message: "Image updated successfully",
      admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating image" });
  }
};
export default { adminProfile, updateAdminProfile, updateProfileImage };
