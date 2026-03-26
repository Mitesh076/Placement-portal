import Student from "../models/student.model.js";
import Company from "../models/company.model.js";
import PlacementStatus from "../models/placementStatus.model.js";
import CompanyData from "../models/companydata.model.js";
import Drive from "../models/drive.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const placedStudents = await PlacementStatus.countDocuments({
      status: "Placed",
    });
    const activeDrives = await CompanyData.countDocuments({ visited: "No" });

    res.status(200).json({
      totalStudents,
      totalCompanies,
      placedStudents,
      activeDrives,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentDrives = async (req, res) => {
  try {
    const drives = await Drive.find()
      .populate("company")
      .sort({ createdAt: -1 });

    const companyData = await CompanyData.find();

    // Merge visited status
    const finalData = drives.map((drive) => {
      const data = companyData.find(
        (c) => c.company.toString() === drive.company._id.toString(),
      );

      return {
        ...drive.toObject(),
        visited: data ? data.visited : "No",
      };
    });

    res.json(finalData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller (adminController.js)

export const getAdminProfile = async (req, res) => {
  try {
    console.log("TOKEN USER:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "No user found" });
    }

    const userId = req.user.id;

    console.log("USER ID:", userId);

    // 🔥 FIXED QUERY (REFERENCE BASED)
    const admin = await Admin.findOne({ user: userId }).populate("user");

    console.log("ADMIN DATA:", admin);

    if (!admin) {
      return res.status(404).json({ message: "Admin profile not found" });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (err) {
    console.log("PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
export default { getDashboardStats, getRecentDrives, getAdminProfile };
