import Companydata from "../models/companydata.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Company from "../models/company.model.js";

async function Cdata(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    const company = await Company.findOne({ user: decoded.id });

    if (decoded.role !== "company") {
      return res
        .status(403)
        .json({ message: "You dont have access to use the Company profile " });
    }

    const { verified, visited, completion } = req.body;

    const compdata = await Companydata.create({
      user: decoded.id,
      company: company._id,
      verified,
      visited,
      completion,
    });

    return res.status(201).json({
      message: "Status Fetched Successfully ",
      pstatus: {
        id: user._id,
        name: company.name,
        verified: compdata.verified,
        visited: compdata.visited,
        completion: compdata.completion,
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

export default { Cdata };
