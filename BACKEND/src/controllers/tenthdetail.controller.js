import Tenthdetail from "../models/tenthdetail.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";

async function Tenthdetails(req, res) {
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

    const { board, percentage, year, school } = req.body;

    const tenth = await Tenthdetail.create({
      user: decoded.id,
      board,
      percentage,
      year,
      school,
    });

    return res.status(201).json({
      message: "Your 10 Details Posted  Successfully ",
      tenth: {
        id: user._id,
        name: student.name,
        board: tenth.board,
        percentage: tenth.percentage,
        year: tenth.year,
        school: tenth.school,
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

export default { Tenthdetails };
