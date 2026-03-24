import Applied from "../models/applied.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";

async function Appliedcompanies(req, res) {
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

    const { cname, role, appliedon, nextroundon, nextround, progress, status } =
      req.body;

    const applied = await Applied.create({
      user: decoded.id,
      cname,
      role,
      appliedon,
      nextroundon,
      nextround,
      progress,
      status,
    });

    return res.status(201).json({
      message: "Your Offers Posted  Successfully ",
      applied: {
        id: user._id,
        name: student.name,
        cname: applied.cname,
        role: applied.role,
        appliedon: applied.appliedon,
        nextroundon: applied.nextroundon,
        nextround: applied.nextround,
        progress: applied.progress,
        status: applied.status,
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

export default { Appliedcompanies };
