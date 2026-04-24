import PlacementStatus from "../models/placementStatus.model.js";
import Student from "../models/student.model.js";
import Tenthdetails from "../models/tenthdetail.model.js";
import Twelthdetails from "../models/twelthdetail.model.js";
import Sem from "../models/sem.model.js"; // 🔥 add this

export const updateCompletion = async (userId) => {
  try {
    const student = await Student.findOne({ user: userId });
    if (!student) return;

    // ✅ FIXED QUERIES
    const tenth = await Tenthdetails.findOne({ user: userId });
    const twelfth = await Twelthdetails.findOne({ user: userId });
    const sem = await Sem.findOne({ user: userId });

    const isFilled = (value) =>
      value !== undefined && value !== null && value !== "";

    /* ===========================
       PROFILE CHECKS
    =========================== */
    const hasProfilePic = isFilled(student.profilepic);

    const hasPersonalDetails =
      isFilled(student.name) &&
      isFilled(student.erno) &&
      isFilled(student.gender) &&
      isFilled(student.branch) &&
      isFilled(student.sem) &&
      isFilled(student.cgpa);

    const hasContactDetails =
      isFilled(student.email) && isFilled(student.mobile);

    /* ===========================
       ACADEMIC CHECKS
    =========================== */

    const hasTenth =
      tenth &&
      isFilled(tenth.school) &&
      isFilled(tenth.percentage) &&
      isFilled(tenth.year) &&
      isFilled(tenth.board);

    const hasTwelfth =
      twelfth &&
      isFilled(twelfth.board) &&
      isFilled(twelfth.stream) &&
      isFilled(twelfth.percentage) &&
      isFilled(twelfth.year) &&
      isFilled(twelfth.school);

    // 🔥 NEW: SEM CHECK (important)
    const hasSem =
      sem &&
      Object.values(sem.toObject()).some(
        (v, i) => i > 1 && isFilled(v) // skip _id & user
      );

    const hasAcademicDetails = hasTenth && hasTwelfth && hasSem;

    /* ===========================
       CALCULATE COMPLETION
    =========================== */

    let completion = 0;

    if (hasProfilePic) completion += 10;
    if (hasPersonalDetails) completion += 30;
    if (hasContactDetails) completion += 20;
    if (hasAcademicDetails) completion += 40;

    /* ===========================
       UPDATE STATUS
    =========================== */

    await PlacementStatus.findOneAndUpdate(
      { user: userId },
      { completion },
      { returnDocument: "after", upsert: true }
    );

    console.log("Completion:", completion); // ✅ debug
  } catch (error) {
    console.log("Completion Error:", error);
  }
};