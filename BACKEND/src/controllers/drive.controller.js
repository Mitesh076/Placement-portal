import Drive from "../models/drive.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Company from "../models/company.model.js";

async function PDrive(req, res) {
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
        .json({ message: "You dont have access to use the company profile " });
    }

    const {
      roles,
      pack,
      ebranches,
      drivedate,
      jobtype,
      mincgpa,
      bond,
      lastdate,
    } = req.body;

    const dstatus = await Drive.create({
      user: decoded.id,
      company: company._id,
      roles,
      pack,
      ebranches,
      drivedate,
      jobtype,
      mincgpa,
      bond,
      lastdate,
    });

    return res.status(201).json({
      message: "Drive Details Saved Successfully ",
      dstatus: {
        id: user._id,
        name: company.name,
        roles: dstatus.roles,
        pack: dstatus.pack,
        ebranches: dstatus.ebranches,
        drivedate: dstatus.drivedate,
        jobtype: dstatus.jobtype,
        mincgpa: dstatus.mincgpa,
        bond: dstatus.bond,
        lastdate: dstatus.lastdate,
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

export const createDrive = async (req, res) => {
  try {
    const {
      companyId,
      roles,
      pack,
      ebranches,
      drivedate,
      jobtype,
      mincgpa,
      bond,
      lastdate,
    } = req.body;

    const drive = await Drive.create({
      user: req.user._id, // from auth middleware
      company: companyId,
      roles,
      pack,
      ebranches,
      drivedate,
      jobtype,
      mincgpa,
      bond,
      lastdate,
    });

    res.status(201).json(drive);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { PDrive, createDrive };
