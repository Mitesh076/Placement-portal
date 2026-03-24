import express from "express";
import companycontroller from "../controllers/company.controller.js";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/profile",
  upload.single("profilepic"),
  companycontroller.companyProfile,
);

export default router;
