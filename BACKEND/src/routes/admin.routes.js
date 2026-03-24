import express from "express";
import admincontrollers from "../controllers/admin.controller.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/profile",
  upload.single("profilepic"),
  admincontrollers.adminProfile,
);

export default router;
