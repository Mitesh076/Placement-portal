import express from "express";
import admincontrollers from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import multer from "multer";
import {
  getAllStudents,
  getVerificationStudents,
  updateVerificationStatus,
} from "../controllers/student.controller.js";

import {
  getVerificationCompanies,
  updateCompanyVerification,
  getVisitedCompanies,
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

export default router;
