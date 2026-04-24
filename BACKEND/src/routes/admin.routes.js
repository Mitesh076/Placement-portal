import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { postDrive } from "../controllers/drive.controller.js";

import {
  getAllStudents,
  getVerificationStudents,
  updateVerificationStatus,
  getEligibleStudents,
  getPlacedStudents,
} from "../controllers/student.controller.js";

import {
  getVerificationCompanies,
  updateCompanyVerification,
  getVisitedCompanies,
  getApprovedCompanies,
  getCompanyWisePlacement,
} from "../controllers/company.controller.js";

import { togglePlacement } from "../controllers/placementStatus.controller.js";

import {
  getDashboardStats,
  getRecentDrives,
  getCompanyStats,
} from "../controllers/admindash.controller.js";

import {
  upsertAdminProfile,
  getAdminProfile,
  updateAdminProfile,
  deleteUser,
  getAdmins,
  getAllUsers,
  getStudents,
  getCompanies,
} from "../controllers/admin.controller.js";

import { getReportStats } from "../controllers/report.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post("/profile", upload.single("profilepic"), upsertAdminProfile);
router.get("/profile", getAdminProfile);
router.put("/profile", upload.single("profilepic"), updateAdminProfile);

router.get("/stats", getDashboardStats);
router.get("/drives", getRecentDrives);

router.delete(
  "/delete/:id",
  (req, res, next) => {
    console.log("🔥 DELETE ROUTE HIT");
    next();
  },
  deleteUser,
);

router.get("/students", getStudents);
router.get("/admins", getAdmins);
router.get("/companies", getCompanies);
router.get("/users", getAllUsers);

router.get("/placed", getAllStudents);
router.put("/:id/toggle", togglePlacement);

// ----------------------------------------------------------
router.get("/sverified", getVerificationStudents);
router.put("/sverification/:id", updateVerificationStatus);
router.get("/cverified", getVerificationCompanies);
router.put("/cverification/:id", updateCompanyVerification);
// ---------------------------------------------------------------------------
router.get("/compstats", getCompanyStats);
router.get("/visitedstats", getVisitedCompanies);

router.get("/approved-companies", getApprovedCompanies);
router.post("/drive/post/:companyId", postDrive);
router.get("/drive/eligible/:driveId", getEligibleStudents);

router.get("/report-stats", getReportStats);
router.get("/report-pstudents", getPlacedStudents);
router.get("/reports-cwise", getCompanyWisePlacement);

export default router;
