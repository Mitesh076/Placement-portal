import express from "express";
import companycontroller from "../controllers/company.controller.js";
import multer from "multer";
import companydataController from "../controllers/companydata.controller.js";
import drivecontroller from "../controllers/drive.controller.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/profile",
  upload.single("profilepic"),
  companycontroller.companyProfile,
);

router.post("/data", companydataController.Cdata);
router.post("/drive", drivecontroller.PDrive);

export default router;
