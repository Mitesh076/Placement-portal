import Student from "../models/student.model.js";
import mongoose from "mongoose";
import { uploadFile } from "../Services/student.storage.service.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import CompanyData from "../models/companydata.model.js";
import PlacementStatus from "../models/placementStatus.model.js";
import Drive from "../models/drive.model.js";
import Applied from "../models/applied.model.js";
import PlacementOffers from "../models/placementOffers.model.js";
import Tenthdetail from "../models/tenthdetail.model.js";
import Twelthdetail from "../models/twelthdetail.model.js";
import Sem from "../models/sem.model.js";
import Company from "../models/company.model.js";

import { updateCompletion } from "../utils/updateCompletion.js";

// Admin module controllers

export const getAllStudents = async (req, res) => {
  try {
    // 1️⃣ Fetch both collections
    const students = await Student.find();
    const placements = await PlacementStatus.find();

    // 2️⃣ Merge data
    const merged = students.map((student) => {
      // match using user field
      const placement = placements.find(
        (p) => p.user?.toString() === student.user?.toString(),
      );

      return {
        _id: student._id,
        studentId: student.erno,
        name: student.name,
        branch: student.branch,
        applied: placement?.applied || 0,
        placed: placement?.status === "Placed",
      };
    });

    res.status(200).json(merged);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getVerificationStudents = async (req, res) => {
  try {
    const students = await Student.find();
    const placements = await PlacementStatus.find();
    const sems = await Sem.find();

    // ✅ Map for fast lookup by user id
    const placementMap = {};
    placements.forEach((p) => {
      placementMap[p.user?.toString()] = p;
    });

    // ✅ Sem map for fast lookup by user id
    const semMap = {};
    sems.forEach((s) => {
      semMap[s.user?.toString()] = s;
    });

    const merged = students.map((student) => {
      const userId = student.user?.toString();
      const placement = placementMap[userId];
      const sem = semMap[userId];

      // ✅ Calculate total backlogs from all sem backlog fields
      const totalBacklogs = sem
        ? sem.sem1b +
          sem.sem2b +
          sem.sem3b +
          sem.sem4b +
          sem.sem5b +
          sem.sem6b +
          sem.sem7b +
          sem.sem8b
        : 0;

      return {
        _id: student._id,
        placementId: placement?._id || null, // ✅ needed for update
        studentId: student.erno,
        name: student.name,
        department: student.branch,
        cgpa: student.cgpa,
        backlogs: totalBacklogs,
        status: placement?.verified || "Unverified",
      };
    });

    // ✅ Split into two separate lists
    const pendingStudents = merged.filter(
      (s) => s.status === "Unverified" || s.status === "Pending",
    );

    const verifiedStudents = merged.filter((s) => s.status === "Verified");

    res.status(200).json({
      pending: pendingStudents,
      verified: verifiedStudents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateVerificationStatus = async (req, res) => {
  try {
    const { id } = req.params; // placement id
    const { status } = req.body; // "Verified" or "Rejected"

    // ✅ Validate status value
    if (!["Verified", "Unverified", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const record = await PlacementStatus.findById(id);

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    record.verified = status;
    await record.save();

    res.status(200).json({
      message: "Verification updated",
      record,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getEligibleStudents = async (req, res) => {
  try {
    const { driveId } = req.params;

    const drive = await Drive.findById(driveId);
    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    // ✅ Handle both array and comma-separated string for ebranches
    const branches = Array.isArray(drive.ebranches)
      ? drive.ebranches.map((b) => b.trim())
      : drive.ebranches.split(",").map((b) => b.trim());

    console.log(
      "Drive:",
      drive.name,
      "| Min CGPA:",
      drive.mincgpa,
      "| Branches:",
      branches,
    );

    // ✅ Fetch all students with their placement status
    const students = await Student.find();
    const placements = await PlacementStatus.find();

    // ✅ Map placement status by user id
    const placementMap = {};
    placements.forEach((p) => {
      placementMap[p.user?.toString()] = p;
    });

    const eligible = students
      .filter((s) => {
        const placement = placementMap[s.user?.toString()];

        const meetscgpa = s.cgpa >= drive.mincgpa;
        const meetsBranch = branches.includes(s.branch);
        const isVerified = placement?.verified === "Verified"; // ✅ only verified students
        const noBacklog = drive.allowBacklog // ✅ check if drive allows backlogs
          ? true
          : (placement?.backlogs ?? 0) === 0;

        return meetscgpa && meetsBranch && isVerified && noBacklog;
      })
      .map((s) => {
        const placement = placementMap[s.user?.toString()];
        return {
          _id: s._id,
          name: s.name,
          erno: s.erno,
          branch: s.branch,
          cgpa: s.cgpa,
          sem: s.sem,
          email: s.email,
          mobile: s.mobile,
          verified: placement?.verified || "Unverified",
          backlogs: placement?.backlogs ?? 0,
        };
      });

    console.log("Total eligible:", eligible.length);

    res.status(200).json(eligible);
  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getPlacedStudents = async (req, res) => {
  try {
    const { branch, batch } = req.query;

    // ✅ Get placed placements
    const placements = await PlacementStatus.find({ status: "Placed" });

    // ✅ Get all students and map by user id
    const students = await Student.find();
    const studentMap = {};
    students.forEach((s) => {
      studentMap[s.user?.toString()] = s;
    });

    const result = placements
      .map((p) => {
        const student = studentMap[p.user?.toString()];
        if (!student) return null;

        // ✅ Apply filters
        if (branch && branch !== "All" && student.branch !== branch)
          return null;
        if (batch && batch !== "All" && student.batch !== Number(batch))
          return null;

        return {
          erno: student.erno,
          name: student.name,
          branch: student.branch,
          pcname: p.pcname || "N/A", // ✅ placed company name from PlacementStatus
          pack: p.pack || "N/A",
        };
      })
      .filter(Boolean); // ✅ remove nulls

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Student module controllers

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
    const { name, erno, gender, batch, sem, branch, cgpa, email, mobile } =
      req.body;

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
      batch,
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
        batch: student.batch,
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

export const createStudentProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "student") {
      return res.status(403).json({
        message: "Access denied. Only students allowed",
      });
    }

    const user = await User.findById(decoded.id);

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    const { name, erno, gender, batch, sem, branch, cgpa, email, mobile } =
      req.body;

    /* 🔍 Duplicate Check */
    const existing = await Student.findOne({
      $or: [{ email }, { erno }, { mobile }],
    });

    if (existing) {
      return res.status(400).json({
        message: "Email / Enrollment / Mobile already exists",
      });
    }

    /* ☁️ Upload Image */
    const result = await uploadFile(file.buffer.toString("base64"));

    /* 🧾 Create Student */
    const student = await Student.create({
      user: decoded.id,
      profilepic: result.url,
      name,
      erno,
      gender,
      batch,
      sem,
      branch,
      cgpa,
      email: email || user.email,
      mobile,
    });

    /* 📊 Create Placement Status (only once) */
    const existingStatus = await PlacementStatus.findOne({
      user: decoded.id,
    });

    if (!existingStatus) {
      await PlacementStatus.create({
        user: decoded.id,
        student: student._id,
        company: "",
        eligible: 0,
        applied: 0,
        total: 0,
        completion: 0,
      });
    }

    /* 🔥 Update Completion */
    await updateCompletion(decoded.id);

    res.status(201).json({
      message: "Profile created successfully",
      student,
    });
  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate data not allowed",
      });
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getStudentProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findOne({ user: decoded.id });

    if (!student) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const placement = await PlacementStatus.findOne({
      user: decoded.id,
    });

    res.status(200).json({
      student,
      completion: placement?.completion || 0,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching profile",
    });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Student.findOne({ user: decoded.id });

    if (!student) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const { name, erno, gender, batch, sem, branch, cgpa, email, mobile } =
      req.body;

    /* 🔍 Duplicate Check (exclude current student) */
    const duplicate = await Student.findOne({
      $or: [{ email }, { erno }, { mobile }],
      _id: { $ne: student._id },
    });

    if (duplicate) {
      return res.status(400).json({
        message: "Email / Enrollment / Mobile already exists",
      });
    }

    let profilepic = student.profilepic;

    /* 📸 Update Image if provided */
    if (req.file) {
      const result = await uploadFile(req.file.buffer.toString("base64"));
      profilepic = result.url;
    }

    /* 🧾 Update Data */
    const updatedStudent = await Student.findByIdAndUpdate(
      student._id,
      {
        name,
        erno,
        gender,
        batch,
        sem,
        branch,
        cgpa,
        email,
        mobile,
        profilepic,
      },
      { returnDocument: "after" },
    );

    /* 🔥 Update Completion */
    await updateCompletion(decoded.id);

    res.status(200).json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Error updating profile",
    });
  }
};

// -------------------------------------------------------------------------

export const saveTenthDetails = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { board, percentage, year, school } = req.body;

    const tenth = await Tenthdetail.findOneAndUpdate(
      { user: decoded.id }, // 🔍 find by user
      { board, percentage, year, school }, // ✏️ update data
      {
        upsert: true, // ✅ create if not exists
        returnDocument: "after", // ✅ latest doc (fix warning)
      },
    );

    // 🔥 CALL YOUR COMPLETION UTIL
    await updateCompletion(decoded.id);

    return res.status(200).json({
      message: "10th details saved successfully",
      tenth,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error saving 10th details",
    });
  }
};

export const saveTwelthDetails = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { board, stream, percentage, year, school } = req.body;

    const twelth = await Twelthdetail.findOneAndUpdate(
      { user: decoded.id },
      { board, stream, percentage, year, school },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    // 🔥 CALL COMPLETION
    await updateCompletion(decoded.id);

    return res.status(200).json({
      message: "12th details saved successfully",
      twelth,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error saving 12th details",
    });
  }
};

export const saveSemDetails = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const semData = req.body; // all sem fields

    const sem = await Sem.findOneAndUpdate({ user: decoded.id }, semData, {
      upsert: true,
      returnDocument: "after",
    });

    // 🔥 CALL COMPLETION
    await updateCompletion(decoded.id);

    return res.status(200).json({
      message: "Semester details saved successfully",
      sem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error saving semester details",
    });
  }
};

export const getAcademicDetails = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const tenth = await Tenthdetail.findOne({ user: decoded.id });
    const twelth = await Twelthdetail.findOne({ user: decoded.id });
    const sem = await Sem.findOne({ user: decoded.id });

    return res.status(200).json({
      tenth: tenth || null,
      twelth: twelth || null,
      sem: sem || null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching academic details",
    });
  }
};

// ----------------------------------------------------------
export const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // =========================
    // 1. PLACEMENT STATUS (STATS CARDS)
    // =========================
    const placement = await PlacementStatus.findOne({ user: userId });

    if (!placement) {
      return res.status(404).json({ message: "Placement data not found" });
    }

    const stats = {
      completion: placement.completion,
      applied: placement.applied,
      eligible: placement.eligible,
      verified: placement.verified,
    };

    // =========================
    // 2. STUDENT DETAILS
    // =========================
    const student = await Student.findById(placement.student).select(
      "name profilepic",
    );

    // =========================
    // 3. UPCOMING DRIVES
    // =========================
    const companyData = await CompanyData.find({ visited: false })
      .select("company")
      .lean();

    const allowedCompanyIds = companyData.map((c) => c.company.toString());

    console.log("Allowed Companies:", allowedCompanyIds);

    // ✅ GET DRIVES + COMPANY
    const drives = await Drive.find({})
      .populate("company", "name location")
      .lean();

    // ✅ FILTER DRIVES
    const filteredDrives = drives.filter((d) =>
      allowedCompanyIds.includes(d.company?._id.toString()),
    );

    // ✅ FORMAT
    const upcomingDrives = filteredDrives.map((d) => ({
      company: d.company?.name || "N/A",
      location: d.company?.location || "N/A",
      package: d.pack,
      date: d.drivedate,
    }));

    // =========================
    // 4. RECENT APPLICATIONS
    // =========================
    const applications = await Applied.find({ user: userId })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentApplications = applications.map((app) => ({
      company: app.cname,
      status: app.status,
      round: app.nextround,
      totalRounds: app.totalRounds,
      roundsCleared: app.roundsCleared,
    }));

    // =========================
    // FINAL RESPONSE
    // =========================
    res.status(200).json({
      success: true,
      data: {
        stats,
        student,
        upcomingDrives,
        recentApplications,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const requestVerification = async (req, res) => {
  try {
    const userId = req.user.id;

    const placement = await PlacementStatus.findOne({ user: userId });

    placement.verified = "Pending";
    await placement.save();

    res.json({
      success: true,
      message: "Verification Requested",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ------------------------------------------------------

// Get placement stats for a student
export const getPlacementStats = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ get from token

    const stats = await PlacementStatus.findOne({ user: userId });

    if (!stats) {
      return res.status(200).json({
        total: 0,
        eligible: 0,
        applied: 0,
        completion: 0,
        status: "Not Started",
        verified: false,
      });
    }

    res.status(200).json({
      total: stats.total || 0,
      eligible: stats.eligible || 0,
      applied: stats.applied || 0,
      completion: stats.completion || 0,
      status: stats.status || "Pending",
      verified: stats.verified ?? false,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch placement stats",
      error: error.message,
    });
  }
};

export const getAppliedCompanies = async (req, res) => {
  try {
    const userId = req.user.id; // 👈 comes from token

    const applications = await Applied.find({ user: userId })
      .populate("company")
      .sort({ createdAt: -1 });

    const formattedData = applications.map((app) => {
      const totalRounds = app.totalRounds || 4;
      const cleared = app.roundsCleared || 0;

      return {
        id: app._id,
        companyName: app.company?.name || app.cname,
        role: app.role,
        appliedDate: app.appliedon,
        roundsCleared: cleared,
        totalRounds: totalRounds,
        progressPercent:
          totalRounds > 0 ? Math.round((cleared / totalRounds) * 100) : 0,

        nextRound: app.nextround || null,
        nextRoundDate: app.nextroundon || null,

        status: app.status || "Applied",
        createdAt: app.createdAt,
      };
    });

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applied companies",
      error: error.message,
    });
  }
};

// ----------------------------------------------------------
export const getAvailableCompanies = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Get student
    const student = await Student.findOne({ user: userId });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const cgpa = student.cgpa;

    // ✅ Get OPEN companies (visited = false)
    const openCompanies = await CompanyData.find({
      visited: false,
    });

    const companyIds = openCompanies.map((c) => c.company.toString());

    // ✅ Get drives
    const drives = await Drive.find({
      company: { $in: companyIds },
    }).populate("company");

    // ✅ Get applied data
    const appliedData = await Applied.find({ user: userId });

    const appliedSet = new Set(
      appliedData.filter((a) => a.drive).map((a) => a.drive.toString()),
    );

    let eligible = 0;
    let notEligible = 0;

    const formattedDrives = drives.map((d) => {
      const isEligible = cgpa >= d.mincgpa;

      if (isEligible) eligible++;
      else notEligible++;

      return {
        id: d._id,
        companyName: d.company?.name,
        location: d.company?.location,
        role: d.roles,
        package: d.pack,
        lastDate: d.lastdate,
        driveDate: d.drivedate,
        mincgpa: d.mincgpa,

        isEligible,
        applied: appliedSet.has(d._id.toString()),
      };
    });

    // ✅ CALCULATIONS
    const total = drives.length;
    const applied = appliedData.length;

    // ✅ SAVE IN PlacementStatus (CORRECT FIELDS)
    let placement = await PlacementStatus.findOne({ user: userId });

    if (placement) {
      placement.total = total;
      placement.eligible = eligible;
      placement.applied = applied;

      await placement.save();
    }

    res.status(200).json({
      stats: {
        total,
        eligible,
        notEligible,
        applied,
      },
      drives: formattedDrives,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch available companies",
      error: error.message,
    });
  }
};

export const applyToDrive = async (req, res) => {
  try {
    const userId = req.user.id;
    const { driveId } = req.body;

    // ✅ prevent duplicate (safe check)
    const existing = await Applied.findOne({
      user: userId,
      drive: driveId,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already applied to this drive",
      });
    }

    // ✅ get drive details
    const drive = await Drive.findById(driveId).populate("company");

    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    // ✅ create application with rounds system
    const newApp = await Applied.create({
      user: userId,
      drive: driveId,
      company: drive.company._id,
      cname: drive.company.name,
      role: drive.roles,
      status: "Applied",
      totalRounds: 4,
      roundsCleared: 0,
      nextround: "Aptitude Test",
      nextroundon: null,
      appliedon: new Date(),
    });

    // ✅ increment sappeared count on the company
    await Company.findByIdAndUpdate(
      drive.company._id,
      { $inc: { sappeared: 1 } },
      { new: true },
    );

    res.status(201).json({
      message: "Applied successfully",
      data: newApp,
    });
  } catch (error) {
    // ✅ unique constraint safety
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already applied to this drive",
      });
    }

    res.status(500).json({
      message: "Apply failed",
      error: error.message,
    });
  }
};

// -------------------------------------------------------------------------

export const getPlacementStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ 1. Counts from Applied schema
    const stats = await Applied.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          totalApplied: { $sum: 1 },
          shortlisted: {
            $sum: {
              $cond: [{ $eq: ["$status", "Shortlisted"] }, 1, 0],
            },
          },
          selected: {
            $sum: {
              $cond: [{ $eq: ["$status", "Selected"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const counts = stats[0] || {
      totalApplied: 0,
      shortlisted: 0,
      selected: 0,
    };

    // ✅ 2. Placement status
    const placement = await PlacementStatus.findOne({ user: userId });

    // ✅ 3. Offers from PlacementOffers schema
    const offers = await PlacementOffers.find({ user: userId }).select(
      "cname role pack location bond choice",
    );

    res.status(200).json({
      success: true,
      data: {
        totalApplied: counts.totalApplied,
        shortlisted: counts.shortlisted,
        selected: counts.selected,
        placementStatus: placement?.status || "Unplaced",
        offers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const acceptOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.user.id;

    const offer = await PlacementOffers.findOne({
      _id: offerId,
      user: userId,
    });

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // ✅ Accept this offer
    offer.choice = "Accepted";
    await offer.save();

    // ✅ Reject all other offers
    await PlacementOffers.updateMany(
      { user: userId, _id: { $ne: offerId } },
      { choice: "Rejected" },
    );

    // ✅ Set placement status = Placed
    await PlacementStatus.findOneAndUpdate(
      { user: userId },
      {
        status: "Placed",
        pcname: offer.cname,
        pack: offer.pack,
        comp: offer.company,
      },
      { new: true, upsert: true },
    );

    // ✅ Increment splaced count on the company
    await Company.findByIdAndUpdate(
      offer.company,
      { $inc: { splaced: 1 } },
      { new: true },
    );

    res.json({
      success: true,
      message: "Offer accepted, status updated to Placed",
    });
  } catch (err) {
    res.status(500).json({ message: "Error accepting offer" });
  }
};

export const rejectOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const userId = req.user.id;

    const offer = await PlacementOffers.findOneAndUpdate(
      { _id: offerId, user: userId },
      { choice: "Rejected" },
      { new: true },
    );

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    // ✅ Check if any accepted offers still exist
    const acceptedOffer = await PlacementOffers.findOne({
      user: userId,
      choice: "Accepted",
    });

    // ❗ If none accepted → set Unplaced
    if (!acceptedOffer) {
      await PlacementStatus.findOneAndUpdate(
        { user: userId },
        { status: "Unplaced", pcname: null, pack: null },
        { new: true, upsert: true },
      );
    }

    res.json({ success: true, message: "Offer rejected, status updated" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting offer" });
  }
};

export default {
  acceptOffer,
  rejectOffer,
  getPlacementStatus,
  applyToDrive,
  getAvailableCompanies,
  getAppliedCompanies,
  getPlacementStats,
  getStudentDashboard,
  requestVerification,
  saveTenthDetails,
  saveTwelthDetails,
  saveSemDetails,
  getAcademicDetails,
  studentProfile,
  updateStudentProfile,
  createStudentProfile,
  getStudentProfile,
  getEligibleStudents,
  getPlacedStudents,
};
