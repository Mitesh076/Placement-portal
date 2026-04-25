import Applied from "../models/applied.model.js";
import Company from "../models/company.model.js";
import PlacementStatus from "../models/placementStatus.model.js";
import PlacementOffers from "../models/placementOffers.model.js";
import Student from "../models/student.model.js";

const ROUNDS = [
  { id: 1, name: "Online Test" },
  { id: 2, name: "Technical Interview" },
  { id: 3, name: "HR Interview" },
  { id: 4, name: "Offer Letter" },
];

// ─────────────────────────────────────────────────────────────
//  HELPERS
//  Applied.user → User._id
//  Student.user → User._id  (same ObjectId, different collection)
// ─────────────────────────────────────────────────────────────
const buildStudentMap = async (applicants) => {
  const userIds = applicants.map((a) => a.user._id);
  const docs = await Student.find({ user: { $in: userIds } });
  const map = new Map();
  docs.forEach((s) => map.set(s.user.toString(), s));
  return map;
};

const mergeApplicant = (a, studentMap) => {
  const s = studentMap.get(a.user._id.toString()) || {};
  return {
    _id: a._id,
    userId: a.user._id,
    email: a.user.email,
    name: s.name || "N/A",
    branch: s.branch || "N/A",
    erno: s.erno || "N/A",
    cgpa: s.cgpa ?? "N/A",
    gender: s.gender || "N/A",
    batch: s.batch || "N/A",
    mobile: s.mobile || "N/A",
    status: a.status,
    roundsCleared: a.roundsCleared,
    totalRounds: a.totalRounds,
    currentRound: a.roundsCleared + 1,
    nextround: a.nextround,
    nextroundon: a.nextroundon,
    appliedon: a.appliedon,
  };
};

// ─────────────────────────────────────────────────────────────
//  1. GET /company/drives
//     Returns all drives for the logged-in company
//     Frontend uses this to populate the drive selector dropdown
// ─────────────────────────────────────────────────────────────
export const getDrives = async (req, res) => {
  try {
    const userId = req.user.id;
    const company = await Company.findOne({ user: userId });
    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });

    // Import Drive model - adjust path to your project structure
    const Drive = (await import("../models/drive.model.js")).default;

    const drives = await Drive.find({ company: company._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ success: true, drives });
  } catch (err) {
    console.error("getCompanyDrives:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
//  2. GET /company/rounds/:driveId
//     Returns stats + all applicants for a specific drive
// ─────────────────────────────────────────────────────────────
export const getInterviewRoundsData = async (req, res) => {
  try {
    const { driveId } = req.params;
    const userId = req.user.id;

    // Get company from logged-in user
    const company = await Company.findOne({ user: userId });
    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });

    const companyId = company._id;

    console.log("driveId :", driveId);
    console.log("companyId:", companyId);

    // Step 1: fetch Applied docs for this drive + company
    const applicants = await Applied.find({
      drive: driveId,
      company: companyId,
    }).populate("user", "_id email");

    console.log("applicants found:", applicants.length);

    // Step 2: batch fetch Student docs
    const studentMap = await buildStudentMap(applicants);

    // Stats
    const total = applicants.length;
    const selected = applicants.filter((a) => a.status === "Selected").length;
    const rejected = applicants.filter((a) => a.status === "Rejected").length;
    const shortlisted = applicants.filter(
      (a) => a.status === "Shortlisted",
    ).length;
    const applied = applicants.filter((a) => a.status === "Applied").length;

    // Step 3: merge
    const students = applicants.map((a) => mergeApplicant(a, studentMap));

    return res.status(200).json({
      success: true,
      stats: {
        total,
        selected,
        rejected,
        shortlisted,
        applied,
        inProgress: applied + shortlisted,
      },
      students,
      rounds: ROUNDS,
    });
  } catch (err) {
    console.error("getInterviewRoundsData:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
//  3. PATCH /company/rounds/action
//     Select OR Reject a student for a specific round
//  Body: { appliedId, roundId, action: "select" | "reject" }
// ─────────────────────────────────────────────────────────────
export const handleRoundAction = async (req, res) => {
  try {
    const { appliedId, roundId, action } = req.body;

    if (!appliedId || !roundId || !action) {
      return res.status(400).json({
        success: false,
        message: "appliedId, roundId, and action are required",
      });
    }

    const application = await Applied.findById(appliedId);
    if (!application)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });

    const rId = parseInt(roundId);
    const isLastRound = rId === ROUNDS.length;

    if (action === "reject") {
      application.status = "Rejected";
      application.nextround = null;
      application.nextroundon = null;
      await application.save();
      return res
        .status(200)
        .json({ success: true, message: "Student rejected", application });
    }

    if (action === "select") {
      if (isLastRound) {
        return res.status(200).json({
          success: true,
          requiresOffer: true,
          message: "Please send an offer letter to finalise selection",
          appliedId,
        });
      }

      // Rounds 1-3: advance
      application.roundsCleared = rId;
      application.status = "Shortlisted";
      const nextRound = ROUNDS[rId];
      application.nextround = nextRound ? nextRound.name : null;
      application.nextroundon = null;
      await application.save();

      return res.status(200).json({
        success: true,
        message: `Student advanced to ${nextRound?.name || "final round"}`,
        application,
      });
    }

    return res.status(400).json({ success: false, message: "Invalid action" });
  } catch (err) {
    console.error("handleRoundAction:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
//  4. POST /company/rounds/offer
//     Send offer letter after all rounds cleared
//  Body: { appliedId, role, pack, bond, location }
// ─────────────────────────────────────────────────────────────
export const sendOffer = async (req, res) => {
  try {
    const { appliedId, role, pack, bond, location } = req.body;
    const userId = req.user.id;
    const company = await Company.findOne({ user: userId });
    if (!company)
      return res
        .status(404)
        .json({ success: false, message: "Company not found" });

    const application = await Applied.findById(appliedId);
    if (!application)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });

    const offer = await PlacementOffers.create({
      user: application.user,
      company: company._id,
      cname: company.name,
      role,
      pack,
      bond,
      location,
      choice: "Pending",
    });

    application.roundsCleared = 4;
    application.status = "Selected";
    application.nextround = "Awaiting Offer Response";
    await application.save();

    return res.status(201).json({
      success: true,
      message: "Offer sent. Awaiting student response.",
      offer,
    });
  } catch (err) {
    console.error("sendOffer:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
//  5. PATCH /student/offers/:offerId/respond
//     Student accepts or rejects an offer
//  Body: { choice: "Accepted" | "Rejected" }
// ─────────────────────────────────────────────────────────────
export const respondToOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { choice } = req.body;
    const userId = req.user.id;

    if (!["Accepted", "Rejected"].includes(choice)) {
      return res.status(400).json({
        success: false,
        message: "choice must be 'Accepted' or 'Rejected'",
      });
    }

    const offer = await PlacementOffers.findById(offerId);
    if (!offer)
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    if (offer.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    offer.choice = choice;
    await offer.save();

    const application = await Applied.findOne({
      user: userId,
      company: offer.company,
    });
    if (!application)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });

    if (choice === "Accepted") {
      application.status = "Selected";
      application.nextround = null;
      await application.save();

      await PlacementStatus.findOneAndUpdate(
        { user: userId },
        {
          status: "Placed",
          company: offer.company,
          pcname: offer.cname,
          pack: offer.pack,
        },
        { new: true },
      );

      await Company.findByIdAndUpdate(offer.company, { $inc: { splaced: 1 } });

      return res.status(200).json({
        success: true,
        message: "Offer accepted! You are now Placed 🎉",
      });
    }

    application.status = "Rejected";
    application.nextround = null;
    await application.save();

    return res.status(200).json({ success: true, message: "Offer rejected." });
  } catch (err) {
    console.error("respondToOffer:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
