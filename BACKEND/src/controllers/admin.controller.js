import Admin from "../models/admin.model.js";
import { uploadFile } from "../Services/admin.storage.service.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";
import Company from "../models/company.model.js";
import Applied from "../models/applied.model.js";
import PlacementStatus from "../models/placementStatus.model.js";
import PlacementOffers from "../models/placementOffers.model.js";

export const getAdminProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findOne({ user: decoded.id });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ admin });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

export const upsertAdminProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(decoded.id);

    const { name, gender, branch, mobile, email } = req.body;

    let admin = await Admin.findOne({ user: decoded.id });

    // duplicate check
    const duplicate = await Admin.findOne({
      $or: [{ email }, { mobile }],
      ...(admin && { _id: { $ne: admin._id } }),
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Email or Mobile already exists",
      });
    }

    let imageUrl =
      admin?.profilepic ||
      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

    if (req.file) {
      const result = await uploadFile(req.file.buffer.toString("base64"));
      imageUrl = result.url;
    }

    // CREATE
    if (!admin) {
      admin = await Admin.create({
        user: decoded.id,
        name,
        gender,
        branch,
        mobile,
        email: email || user.email,
        profilepic: imageUrl,
      });

      return res.status(201).json({
        message: "Admin profile created",
        admin,
      });
    }

    // UPDATE
    admin.name = name || admin.name;
    admin.gender = gender || admin.gender;
    admin.branch = branch || admin.branch;
    admin.mobile = mobile || admin.mobile;
    admin.email = email || admin.email;
    admin.profilepic = imageUrl;

    await admin.save();

    res.status(200).json({
      message: "Admin profile updated",
      admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findOne({ user: decoded.id });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const { name, gender, branch, mobile, email } = req.body;

    // 🔍 Duplicate check
    const duplicate = await Admin.findOne({
      $or: [{ email }, { mobile }],
      _id: { $ne: admin._id },
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Email or Mobile already exists",
      });
    }

    let imageUrl = admin.profilepic;

    // ✅ Update image if provided
    if (req.file) {
      const result = await uploadFile(req.file.buffer.toString("base64"));
      imageUrl = result.url;
    }

    admin.name = name || admin.name;
    admin.gender = gender || admin.gender;
    admin.branch = branch || admin.branch;
    admin.mobile = mobile || admin.mobile;
    admin.email = email || admin.email;
    admin.profilepic = imageUrl;

    await admin.save();

    res.json({
      message: "Profile updated successfully",
      admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating profile" });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // ✅ Fixed destructuring

    // Try finding user directly first
    let user = await User.findById(id);

    // If not found, maybe `id` is a Student/Admin/Company doc id
    if (!user) {
      const student = await Student.findById(id);
      const admin = await Admin.findById(id);
      const company = await Company.findById(id);

      const profile = student || admin || company;
      if (!profile) {
        return res.status(404).json({ message: "User not found" });
      }

      user = await User.findById(profile.user); // resolve via reference
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Delete role-specific profile
    if (user.role === "student")
      await Student.findOneAndDelete({ user: user._id });
    if (user.role === "admin") await Admin.findOneAndDelete({ user: user._id });
    if (user.role === "company")
      await Company.findOneAndDelete({ user: user._id });

    // ✅ Delete related placement data
    await Applied.deleteMany({ user: user._id });
    await PlacementStatus.findOneAndDelete({ user: user._id });
    await PlacementOffers.deleteMany({ user: user._id });

    // ✅ Delete the User itself
    await User.findByIdAndDelete(user._id);

    res.json({ message: "User and related data deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getStudents = async (req, res) => {
  const students = await Student.find().populate("user", "name email");

  res.json(students);
};

export const getAdmins = async (req, res) => {
  const admins = await Admin.find().populate("user", "name email");

  res.json(admins);
};

export const getCompanies = async (req, res) => {
  const companies = await Company.find().populate("user", "name email");

  res.json(companies);
};

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export default {
  getAdminProfile,
  upsertAdminProfile,
  updateAdminProfile,
  deleteUser,
  getStudents,
  getAdmins,
  getAllUsers,
  getCompanies,
};
