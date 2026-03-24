import express from "express";
import studentcontroller from "../controllers/student.controller.js";
import multer from "multer";
import placementStatusController from "../controllers/placementStatus.controller.js";
import placementOffersController from "../controllers/placementOffers.controllers.js";
import appliedController from "../controllers/applied.controller.js";
import tenthdetailcontroller from "../controllers/tenthdetail.controller.js";
import twelthdetailcontroller from "../controllers/twelthdetail.controller.js";
import graduationcontroller from "../controllers/graduation.controller.js";
import semcontroller from "../controllers/sem.controller.js";

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
router.post("/applied", appliedController.Appliedcompanies);
router.post("/tenth", tenthdetailcontroller.Tenthdetails);
router.post("/twelth", twelthdetailcontroller.Twelthdetails);
router.post("/graduation", graduationcontroller.Graduationdetails);
router.post("/sem", semcontroller.Semdetails);

export default router;
