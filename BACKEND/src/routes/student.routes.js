import express from "express";
import studentcontroller from "../controllers/student.controller.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/Profile",
  upload.single("profilepic"),
  studentcontroller.studentProfile,
);

export default router;
