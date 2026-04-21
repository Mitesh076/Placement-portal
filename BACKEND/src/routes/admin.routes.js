import express from "express";
import admincontrollers from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { createDrive } from "../controllers/drive.controller.js";

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
  getAdminProfile,
  getCompanyStats,
} from "../controllers/admindash.controller.js";

import {
  createUser,
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

router.post(
  "/profile",
  upload.single("profilepic"), // or "file"
  admincontrollers.adminProfile,
);

router.put(
  "/profile",
  upload.single("profilepic"), // same name as frontend
  admincontrollers.updateAdminProfile,
);

router.get("/stats", getDashboardStats);
router.get("/drives", getRecentDrives);
router.get("/profile", protect, getAdminProfile);

router.post("/create-user", createUser);
router.delete("/delete-user/:id", deleteUser);

router.get("/students", getStudents);
router.get("/admins", getAdmins);
router.get("/companies", getCompanies);
router.get("/users", getAllUsers);

router.get("/placed", getAllStudents);
router.put("/:id/toggle", togglePlacement);

router.get("/sverified", getVerificationStudents);
router.put("/sverification/:id", updateVerificationStatus);

router.get("/cverified", getVerificationCompanies);
router.put("/cverification/:id", updateCompanyVerification);

router.get("/compstats", getCompanyStats);
router.get("/visitedstats", getVisitedCompanies);

router.get("/approved-companies", getApprovedCompanies);
router.post("/drive/create", createDrive);
router.get("/drive/eligible/:driveId", getEligibleStudents);

router.get("/report-stats", getReportStats);
router.get("/report-pstudents", getPlacedStudents);
router.get("/reports-cwise", getCompanyWisePlacement);

export default router;
