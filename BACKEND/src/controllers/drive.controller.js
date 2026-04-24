import Drive from "../models/drive.model.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

import CompanyData from "../models/companydata.model.js";
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

export const postDrive = async (req, res) => {
  try {
    const { companyId } = req.params;

    // ✅ Find company to get user reference
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // ✅ Check if drive already exists for this company
    let drive = await Drive.findOne({ company: companyId });

    if (!drive) {
      // ✅ Get drive details from CompanyData or request body
      const companyData = await CompanyData.findOne({ company: companyId });
      if (!companyData) {
        return res.status(404).json({ message: "Company data not found" });
      }

      drive = await Drive.create({
        user: company.user,
        company: companyId,
        roles: req.body.roles,
        pack: req.body.pack,
        ebranches: req.body.ebranches,
        drivedate: req.body.drivedate,
        jobtype: req.body.jobtype || "Full-time",
        mincgpa: req.body.mincgpa,
        bond: req.body.bond,
        lastdate: req.body.lastdate,
      });
    }

    // ✅ Fetch eligible students using the drive
    const branches = Array.isArray(drive.ebranches)
      ? drive.ebranches.map((b) => b.trim())
      : drive.ebranches.split(",").map((b) => b.trim());

    const students = await Student.find();
    const placements = await PlacementStatus.find();

    const placementMap = {};
    placements.forEach((p) => {
      placementMap[p.user?.toString()] = p;
    });

    const eligible = students
      .filter((s) => {
        const placement = placementMap[s.user?.toString()];
        const meetsCgpa = s.cgpa >= drive.mincgpa;
        const meetsBranch = branches.includes(s.branch);
        const isVerified = placement?.verified === "Verified";
        return meetsCgpa && meetsBranch && isVerified;
      })
      .map((s) => ({
        _id: s._id,
        name: s.name,
        erno: s.erno,
        branch: s.branch,
        cgpa: s.cgpa,
        email: s.email,
        mobile: s.mobile,
      }));

    // ✅ Mark company as visited
    await CompanyData.findOneAndUpdate(
      { company: companyId },
      { visited: true },
    );

    res.status(200).json({
      drive,
      eligible,
      total: eligible.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------------------------

export const createDrive = async (req, res) => {
  try {
    const userId = req.user.id;

    const companyData = await Company.findOne({ user: userId });

    if (!companyData) {
      return res.status(404).json({ message: "Company not found" });
    }

    const drive = await Drive.create({
      user: userId,
      company: companyData.id,
      roles: req.body.roles,
      pack: req.body.pack,
      ebranches: req.body.ebranches,
      drivedate: req.body.drivedate,
      jobtype: req.body.jobtype,
      mincgpa: req.body.mincgpa,
      bond: req.body.bond,
      lastdate: req.body.lastdate,
    });

    res.status(201).json({
      success: true,
      message: "Drive created successfully",
      data: drive,
    });
  } catch (error) {
    (console.error("CREATE DRIVE ERROR:", error), // 👈 ADD THIS
      res.status(500).json({
        message: "Failed to create drive",
        error: error.message,
      }));
  }
};
export const getCompanyDrives = async (req, res) => {
  try {
    const userId = req.user.id;

    const companyData = await CompanyData.findOne({ user: userId });

    if (!companyData) {
      return res.status(404).json({ message: "Company not found" });
    }

    const drives = await Drive.find({
      company: companyData.company,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: drives,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch drives",
      error: error.message,
    });
  }
};
export const updateDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const drive = await Drive.findOne({
      _id: id,
      user: userId,
    });

    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    const updated = await Drive.findByIdAndUpdate(
      id,
      {
        roles: req.body.roles,
        pack: req.body.pack,
        ebranches: req.body.ebranches,
        drivedate: req.body.drivedate,
        jobtype: req.body.jobtype,
        mincgpa: req.body.mincgpa,
        bond: req.body.bond,
        lastdate: req.body.lastdate,
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Drive updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update drive",
      error: error.message,
    });
  }
};
export const deleteDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const drive = await Drive.findOne({
      _id: id,
      user: userId,
    });

    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    await drive.deleteOne();

    res.status(200).json({
      success: true,
      message: "Drive deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete drive",
      error: error.message,
    });
  }
};
export default {
  PDrive,
  createDrive,
  getCompanyDrives,
  updateDrive,
  deleteDrive,
  postDrive,
};
