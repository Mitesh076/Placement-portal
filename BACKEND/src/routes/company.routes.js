import express from "express";

import { protect } from "../middlewares/auth.middleware.js";
import multer from "multer";
import {
  requestCompanyVerification,
  getSelectedStudents,
  getCompanyDashboardStats,
  getCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
} from "../controllers/company.controller.js";

import {
  createDrive,
  getCompanyDrives,
  updateDrive,
  deleteDrive,
} from "../controllers/drive.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post("/profile", upload.single("profilepic"), createCompanyProfile);
router.get("/profile", getCompanyProfile);
router.put("/profile", upload.single("profilepic"), updateCompanyProfile);

router.get("/stats", protect, getCompanyDashboardStats);
router.get("/selected-students", protect, getSelectedStudents);
router.post("/verify", protect, requestCompanyVerification);


router.post("/drives", protect, createDrive);
router.get("/drives", protect, getCompanyDrives);
router.put("/drives/:id", protect, updateDrive);
router.delete("/drives/:id", protect, deleteDrive);

export default router;
