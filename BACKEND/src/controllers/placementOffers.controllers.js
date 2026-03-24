import PlacementOffers from "../models/placementOffers.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Student from "../models/student.model.js";

async function POffers(req, res) {
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

    const { cname, role, pack, bond, choice, location } = req.body;

    const poffers = await PlacementOffers.create({
      user: decoded.id,
      cname,
      role,
      pack,
      bond,
      choice,
      location,
    });

    return res.status(201).json({
      message: "Your Offers Posted  Successfully ",
      pstatus: {
        id: user._id,
        name: student.name,
        cname: poffers.cname,
        role: poffers.role,
        pack: poffers.pack,
        bond: poffers.bond,
        choice: poffers.choice,
        location: poffers.location,
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

export default { POffers };
