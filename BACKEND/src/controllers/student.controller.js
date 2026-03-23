import Student from "../models/student.model.js";
import { uploadFile } from "../Services/student.storage.service.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

async function studentProfile(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (decoded.role !== "student") {
      return res
        .status(403)
        .json({ message: "You dont have access to use the Student profile " });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Profile image is required" });
    }
    const { name, erno, gender, sem, branch, cgpa, email, mobile } = req.body;

    // Check duplicate email
    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Check duplicate enrollment number
    const existingErno = await Student.findOne({ erno });
    if (existingErno) {
      return res.status(400).json({
        message: "Enrollment number already exists",
      });
    }

    // (Optional) Check mobile too
    const existingMobile = await Student.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        message: "Mobile number already exists",
      });
    }

    const result = await uploadFile(file.buffer.toString("base64"));

    const student = await Student.create({
      profilepic: result.url,
      user: decoded.id,
      name,
      erno,
      gender,
      sem,
      branch,
      cgpa,
      mobile,
      email: email || user.email,
    });

    return res.status(201).json({
      message: "Studdent profile Created successfully ",
      student: {
        id: student._id,
        profilepic: student.profilepic,
        user: student.user,
        name: student.name,
        erno: student.erno,
        gender: student.gender,
        sem: student.sem,
        cgpa: student.cgpa,
        branch: student.branch,
        mobile: student.mobile,
        email: student.email,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate data not allowed",
      });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
}

export default { studentProfile };
