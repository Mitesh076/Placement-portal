import Graduation from "../models/graduation.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";

async function Graduationdetails(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    const student = await Student.findOne({ user: decoded.id });

    if (decoded.role !== "student") {
      return res
        .status(403)
        .json({ message: "You dont have access to use the Student profile " });
    }

    const { course, branch, college, ccgpa } = req.body;

    const gdetails = await Graduation.create({
      user: decoded.id,
      course,
      branch,
      college,
      ccgpa,
    });

    return res.status(201).json({
      message: "Graduation Details Saved Successfully ",
      pstatus: {
        id: user._id,
        name: student.name,
        course: gdetails.course,
        branch: gdetails.branch,
        college: gdetails.college,
        ccgpa: gdetails.ccgpa,
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

export default { Graduationdetails };
