import express from "express";

import { protect } from "../middlewares/auth.middleware.js";
import multer from "multer";
import {
  acceptOffer,
  rejectOffer,
  getPlacementStatus,
  applyToDrive,
  getAvailableCompanies,
  getAppliedCompanies,
  getPlacementStats,
  getStudentDashboard,
  requestVerification,
  saveTenthDetails,
  saveTwelthDetails,
  saveSemDetails,
  getAcademicDetails,
  createStudentProfile,
  getStudentProfile,
  updateStudentProfile,
} from "../controllers/student.controller.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
});
// -----------------------------------------------------------------------
router.post("/profile", upload.single("profilepic"), createStudentProfile);
router.get("/profile", getStudentProfile);
router.put("/profile", upload.single("profilepic"), updateStudentProfile);

// -----------------------------------------------------------------------
router.post("/tenth", saveTenthDetails);
router.post("/twelth", saveTwelthDetails);
router.post("/sem", saveSemDetails);
router.get("/academics", getAcademicDetails);

// ----------------------------------------------------------------

router.get("/student-dashboard", protect, getStudentDashboard);
router.put("/request-verification", protect, requestVerification);
// -----------------------------------------------------------------

router.get("/placementstats", protect, getPlacementStats);
router.get("/appliedcompanies", protect, getAppliedCompanies);
// ----------------------------------------------------------------
router.get("/available-companies", protect, getAvailableCompanies);
router.post("/apply", protect, applyToDrive);
// ---------------------------------------------------------------------

router.get("/pstatus", protect, getPlacementStatus);
router.put("/offer/accept/:offerId", protect, acceptOffer);
router.put("/offer/reject/:offerId", protect, rejectOffer);
// ------------------------------------------------------------------------------

export default router;
