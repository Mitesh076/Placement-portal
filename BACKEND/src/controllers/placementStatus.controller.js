import PlacementStatus from "../models/placementStatus.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";

async function PStatus(req, res) {
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

    const { status, verified, eligible, applied, total, completion } = req.body;

    const pstatus = await PlacementStatus.create({
      user: decoded.id,
      status,
      verified,
      eligible,
      applied,
      total,
      completion,
    });

    return res.status(201).json({
      message: "Status Fetched Successfully ",
      pstatus: {
        id: user._id,
        name: student.name,
        status: pstatus.status,
        verified: pstatus.verified,
        eligible: pstatus.eligible,
        applied: pstatus.applied,
        total: pstatus.total,
        completion: pstatus.completion,
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

export default { PStatus };
