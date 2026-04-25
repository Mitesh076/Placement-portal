import Company from "../models/company.model.js";
import { uploadFile } from "../Services/company.storage.service.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import CompanyData from "../models/companydata.model.js";
import Student from "../models/student.model.js";
import Applied from "../models/applied.model.js";
import Drive from "../models/drive.model.js";
import { Readable } from "stream";
import PlacementStatus from "../models/placementStatus.model.js";
import { updateCCompletion } from "../utils/updateCCompletion.js";

async function companyProfile(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (decoded.role !== "company") {
      return res
        .status(403)
        .json({ message: "You dont have access to use the Company profile " });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Profile image is required" });
    }
    const {
      name,
      industry,
      website,
      location,
      hrname,
      description,
      email,
      mobile,
      sappeared,
      splaced,
    } = req.body;

    // Check duplicate email
    const existingEmail = await Company.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // (Optional) Check mobile too
    const existingMobile = await Company.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        message: "Mobile number already exists",
      });
    }

    const result = await uploadFile(file.buffer.toString("base64"));

    const company = await Company.create({
      profilepic: result.url,
      user: decoded.id,
      name,
      industry,
      website,
      location,
      hrname,
      description,
      mobile,
      sappeared,
      splaced,
      email: email || user.email,
    });

    return res.status(201).json({
      message: "Company profile Created successfully ",
      company: {
        id: company._id,
        profilepic: company.profilepic,
        user: company.user,
        name: company.name,
        industry: company.industry,
        website: company.website,
        location: company.location,
        hrname: company.hrname,
        description: company.description,
        mobile: company.mobile,
        sappeared: company.sappeared,
        splaced: company.splaced,
        email: company.email,
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

// ✅ GET ALL COMPANIES FOR VERIFICATION
export const getVerificationCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    const verifications = await CompanyData.find();

    // ✅ Map by company reference
    const verificationMap = {};
    verifications.forEach((v) => {
      verificationMap[v.company?.toString()] = v;
    });

    const merged = companies.map((company) => {
      const verification = verificationMap[company._id.toString()];

      return {
        _id: company._id,
        verificationId: verification?._id || null, // ✅ needed for update route
        name: company.name,
        industry: company.industry,
        location: company.location,
        status: verification?.verified || "Unverified", // ✅ using "verified" field
      };
    });

    // ✅ Split into two lists
    const pending = merged.filter(
      (c) => c.status === "Unverified" || c.status === "Pending",
    );
    const verified = merged.filter((c) => c.status === "Verified");
    const rejected = merged.filter((c) => c.status === "Rejected");

    res.status(200).json({ pending, verified, rejected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateCompanyVerification = async (req, res) => {
  try {
    const { id } = req.params; // this is company._id
    const { status } = req.body;

    if (!["Verified", "Unverified", "Rejected", "Pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // ✅ Try finding by CompanyData._id first (verificationId)
    let record = await CompanyData.findById(id);

    // ✅ If not found by _id, try finding by company reference
    if (!record) {
      record = await CompanyData.findOne({ company: id });
    }

    // ✅ If still not found, CREATE it (company hasn't filled profile yet)
    if (!record) {
      // Need to find the company's user reference
      const company = await Company.findById(id);

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      record = await CompanyData.create({
        company: id,
        user: company.user, // ✅ required field from schema
        completion: 0, // ✅ required field default
        verified: status,
        visited: false,
      });

      return res.json({ message: "Company verification created", record });
    }

    record.verified = status;
    await record.save();

    res.json({ message: "Company verification updated", record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getVisitedCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    const visited = await CompanyData.find();
    const packdata = await Drive.find();

    // 🔥 Map for fast lookup
    const visitedMap = {};
    visited.forEach((v) => {
      visitedMap[v.company?.toString()] = v;
    });
    const packMap = {};
    packdata.forEach((p) => {
      packMap[p.company?.toString()] = p;
    });

    const merged = companies.map((company) => {
      const Visited = visitedMap[company._id.toString()];
      const packdata = packMap[company._id.toString()];

      return {
        _id: company._id,
        name: company.name,
        location: company.location,
        pack: packdata?.pack || null,
        sappeared: company.sappeared,
        splaced: company.splaced,
        visited: Visited.visited,
      };
    });

    console.log("Companies:", merged);
    res.status(200).json(merged);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getApprovedCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    const verifications = await CompanyData.find();
    const cdata = await Drive.find();

    // ✅ Map by company _id
    const verificationMap = {};
    verifications.forEach((v) => {
      verificationMap[v.company?.toString()] = v;
    });

    const dataMap = {};
    cdata.forEach((d) => {
      dataMap[d.company?.toString()] = d;
    });

    const approved = companies
      .map((c) => {
        const v = verificationMap[c._id.toString()];
        const d = dataMap[c._id.toString()];

        return {
          _id: c._id,
          name: c.name,
          roles: d?.roles || [], // ✅ safe access
          pack: d?.pack || null, // ✅ safe access
          location: c.location,
          verified: v?.verified || "Unverified",
          visited: v?.visited ?? false, // ✅ from CompanyData schema
        };
      })
      // ✅ Only show Verified AND not yet visited
      .filter((c) => c.verified === "Verified" && c.visited === false);

    res.json(approved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const getCompanyWisePlacement = async (req, res) => {
  try {
    const drives = await Drive.find().populate("company");

    const companyMap = {};

    drives.forEach((d) => {
      if (!d.company) return;

      const companyId = d.company._id.toString();

      if (!companyMap[companyId]) {
        companyMap[companyId] = {
          company: d.company.name,
          location: d.company.location,
          totalDrives: 0,
          totalPlaced: d.company.splaced || 0,
          totalPackage: 0, // 🔹 sum of packages
        };
      }

      companyMap[companyId].totalDrives += 1;
      companyMap[companyId].totalPackage += d.pack || 0;
    });

    // 🔹 calculate average
    const result = Object.values(companyMap).map((c) => ({
      company: c.company,
      location: c.location,
      totalDrives: c.totalDrives,
      totalPlaced: c.totalPlaced,
      avgPackage:
        c.totalDrives > 0 ? (c.totalPackage / c.totalDrives).toFixed(2) : 0,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// company dashboard starts

export const createCompanyProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "company") {
      return res.status(403).json({
        message: "Access denied. Only companies allowed",
      });
    }

    const user = await User.findById(decoded.id);

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Profile image is required",
      });
    }

    const {
      name,
      industry,
      website,
      location,
      hrname,
      description,
      email,
      mobile,
      sappeared,
      splaced,
    } = req.body;

    /* 🔍 Duplicate Check */
    const existing = await Company.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existing) {
      return res.status(400).json({
        message: "Email / Enrollment / Mobile already exists",
      });
    }

    /* ☁️ Upload Image */
    const result = await uploadFile(file.buffer.toString("base64"));

    /* 🧾 Create Student */
    const student = await Company.create({
      user: decoded.id,
      profilepic: result.url,
      name,
      industry,
      website,
      location,
      hrname,
      description,
      sappeared,
      splaced,
      email: email || user.email,
      mobile,
    });

    /* 📊 Create Placement Status (only once) */
    const existingStatus = await CompanyData.findOne({
      user: decoded.id,
    });

    if (!existingStatus) {
      await CompanyData.create({
        user: decoded.id,
        company: student._id,
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

export const getCompanyProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Company.findOne({ user: decoded.id });

    if (!student) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const placement = await CompanyData.findOne({
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

export const updateCompanyProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const student = await Company.findOne({ user: decoded.id });

    if (!student) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    const {
      name,
      industry,
      website,
      location,
      hrname,
      description,
      email,
      mobile,
      sappeared,
      splaced,
    } = req.body;

    /* 🔍 Duplicate Check (exclude current student) */
    const duplicate = await Company.findOne({
      $or: [{ email }, { mobile }],
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
    const updatedStudent = await Company.findByIdAndUpdate(
      student._id,
      {
        name,
        industry,
        website,
        location,
        hrname,
        description,
        email,
        mobile,
        sappeared,
        splaced,
        profilepic,
      },
      { returnDocument: "after" },
    );

    /* 🔥 Update Completion */
    await updateCCompletion(decoded.id);

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

// --------------------------------------------------------------

export const getCompanyDashboardStats = async (req, res) => {
  try {
    const companyId = req.user.id; // assuming auth middleware

    // 🔹 Company Info (name + image)
    const company = await Company.findOne({ user: companyId });

    // 🔹 Company Data (completion + verification)
    const companyData = await CompanyData.findOne({ company: company._id });

    // 🔹 Total Students
    const totalStudents = await Student.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        companyName: company?.name,
        companyLogo: company?.profilepic,
        HrName: company?.hrname,
        totalStudents,
        appliedStudents: company?.sappeared,
        selectedStudents: company?.splaced,

        profileCompletion: companyData?.completion || 0,
        verificationStatus: companyData?.verified,
        isVerified: companyData?.verified === "Verified",
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

export const getSelectedStudents = async (req, res) => {
  try {
    const userId = req.user.id;

    // Step 1: get Company._id via CompanyData
    const companyData = await CompanyData.findOne({ user: userId });
    if (!companyData) {
      return res.status(404).json({ message: "Company not found" });
    }
    const companyId = companyData.company;

    // Step 2: find placed students using "comp" field
    const placed = await PlacementStatus.find({
      comp: companyId,
      status: "Placed",
    })
      .populate({
        path: "student",
        select: "name branch erno cgpa batch mobile user profilepic", // ← added profilepic
      })
      .sort({ createdAt: -1 });

    console.log("placed count:", placed.length);

    if (placed.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Step 3: batch fetch User docs for email
    const userIds = placed.map((p) => p.student?.user).filter(Boolean);
    const userDocs = await User.find({ _id: { $in: userIds } }).select(
      "_id email username",
    );
    const userMap = new Map();
    userDocs.forEach((u) => userMap.set(u._id.toString(), u));

    // Step 4: get Applied docs → populate drive with correct field names
    const appliedDocs = await Applied.find({
      company: companyId,
      status: "Selected",
    }).populate("drive", "roles pack bond jobtype drivedate"); // ← correct field names from Drive schema
    const appliedMap = new Map();
    appliedDocs.forEach((a) => appliedMap.set(a.user.toString(), a));

    // Step 5: merge
    const formatted = placed.map((item) => {
      const student = item.student || {};
      const userDoc = userMap.get(student.user?.toString()) || {};
      const applied = appliedMap.get(student.user?.toString()) || {};
      const drive = applied.drive || {};

      return {
        _id: item._id,
        // Student
        name: student.name || "N/A",
        branch: student.branch || "N/A",
        erno: student.erno || "N/A",
        cgpa: student.cgpa ?? "N/A",
        batch: student.batch || "N/A",
        profilepic: student.profilepic || null, // ← from Student
        // User
        email: userDoc.email || "N/A",
        username: userDoc.username || "N/A",
        // PlacementStatus
        pcname: item.pcname || "N/A",
        pack: item.pack || "N/A",
        // Drive
        role: drive.roles || "N/A", // ← "roles" not "role"
        bond: drive.bond || "N/A", // ← added bond
        jobtype: drive.jobtype || "N/A",
        drivedate: drive.drivedate || null,
        // No location field in Drive schema
      };
    });

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error("getSelectedStudents:", error);
    return res.status(500).json({
      message: "Failed to fetch selected students",
      error: error.message,
    });
  }
};
export const requestCompanyVerification = async (req, res) => {
  try {
    const userId = req.user.id;

    const companyData = await CompanyData.findOne({ user: userId });

    if (!companyData) {
      return res.status(404).json({ message: "Company not found" });
    }

    if (companyData.completion < 100) {
      return res.status(400).json({
        message: "Complete profile before requesting verification",
      });
    }

    companyData.verified = "Pending";
    await companyData.save();

    res.status(200).json({
      success: true,
      message: "Verification request sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Verification request failed",
      error: error.message,
    });
  }
};

export const completePlacementProcess = async (req, res) => {
  try {
    const userId = req.user.id; // from protect middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    // 🔍 Find company using logged-in user
    const company = await CompanyData.findOne({ user: userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // ✅ Mark as visited
    company.visited = true;
    await company.save();

    res.status(200).json({
      success: true,
      message: "Placement process completed",
      data: company,
    });
  } catch (error) {
    console.error("COMPLETE PLACEMENT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default {
  requestCompanyVerification,
  getSelectedStudents,
  getCompanyDashboardStats,
  updateCompanyProfile,
  getCompanyProfile,
  createCompanyProfile,
  companyProfile,
  getVisitedCompanies,
  getApprovedCompanies,
  getCompanyWisePlacement,
};
