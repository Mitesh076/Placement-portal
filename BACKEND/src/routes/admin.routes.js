import express from "express";
import admincontrollers from "../controllers/admin.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import multer from "multer";
import {
  registerUser,
  deleteUser,
  getAllUsers,
} from "../controllers/auth.controller.js";

import {
  getDashboardStats,
  getRecentDrives,
  getAdminProfile,
} from "../controllers/admindash.controller.js";

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

router.post("/add", registerUser);
router.delete("/delete/:id", deleteUser);
router.get("/all", getAllUsers);

export default router;
