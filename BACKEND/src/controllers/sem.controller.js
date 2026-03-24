import Sem from "../models/sem.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";

async function Semdetails(req, res) {
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

    const {
      sem1,
      sem1b,
      sem2,
      sem2b,
      sem3,
      sem3b,
      sem4,
      sem4b,
      sem5,
      sem5b,
      sem6,
      sem6b,
      sem7,
      sem7b,
      sem8,
      sem8b,
    } = req.body;

    const sdetails = await Sem.create({
      user: decoded.id,
      sem1,
      sem1b,
      sem2,
      sem2b,
      sem3,
      sem3b,
      sem4,
      sem4b,
      sem5,
      sem5b,
      sem6,
      sem6b,
      sem7,
      sem7b,
      sem8,
      sem8b,
    });

    return res.status(201).json({
      message: "Semester Details Saved Successfully ",
      pstatus: {
        id: user._id,
        name: student.name,
        sem1: sdetails.sem1,
        sem1b: sdetails.sem1b,
        sem2: sdetails.sem2,
        sem2b: sdetails.sem2b,
        sem3: sdetails.sem3,
        sem3b: sdetails.sem3b,
        sem4: sdetails.sem4,
        sem4b: sdetails.sem4b,
        sem5: sdetails.sem5,
        sem5b: sdetails.sem5b,
        sem6: sdetails.sem6,
        sem6b: sdetails.sem6b,
        sem7: sdetails.sem7,
        sem7b: sdetails.sem7b,
        sem8: sdetails.sem8,
        sem8b: sdetails.sem8b,
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

export default { Semdetails };
