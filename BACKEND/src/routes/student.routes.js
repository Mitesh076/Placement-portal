import express from "express";
import studentcontroller from "../controllers/student.controller.js";
import multer from "multer";
import placementStatusController from "../controllers/placementStatus.controller.js";
import placementOffersController from "../controllers/placementOffers.controllers.js";

const upload = multer({
  storage: multer.memoryStorage(),
});

const router = express.Router();

router.post(
  "/profile",
  upload.single("profilepic"),
  studentcontroller.studentProfile,
);
router.post("/pstatus", placementStatusController.PStatus);
router.post("/poffers", placementOffersController.POffers);

export default router;
