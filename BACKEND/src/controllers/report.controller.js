import Student from "../models/student.model.js";
import Drive from "../models/drive.model.js";
import CompanyData from "../models/companyData.model.js";
import PlacementStatus from "../models/placementStatus.model.js";

// 📊 Get Overall Stats
export const getReportStats = async (req, res) => {
  try {
    const { branch, batch } = req.query;

    const filter = {};

    if (branch && branch !== "All") {
      filter.branch = branch;
    }

    if (batch && batch !== "All") {
      filter.batch = Number(batch);
    }

    const totalStudents = await Student.countDocuments(filter);

    const placedStudents = await PlacementStatus.countDocuments({
      status: "Placed",
    });

    const visitedCompanies = await CompanyData.countDocuments({
      visited: true,
    });
    const placementPercentage =
      totalStudents === 0
        ? 0
        : Number(((placedStudents / totalStudents) * 100).toFixed(1));

    res.json({
      totalStudents,
      placedStudents,
      visitedCompanies,
      placementPercentage,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { getReportStats };
