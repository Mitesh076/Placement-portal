import Company from "../models/company.model.js";
import CompanyData from "../models/companydata.model.js";

export const updateCCompletion = async (userId) => {
  try {
    const student = await Company.findOne({ user: userId });
    if (!student) return;

    const isFilled = (value) =>
      value !== undefined && value !== null && value !== "";

    /* ===========================
       PROFILE CHECKS
    =========================== */
    const hasProfilePic = isFilled(student.profilepic);

    const hasPersonalDetails =
      isFilled(student.name) &&
      isFilled(student.industry) &&
      isFilled(student.website) &&
      isFilled(student.location) &&
      isFilled(student.hrname) &&
      isFilled(student.sappeared) &&
      isFilled(student.splaced) &&
      isFilled(student.description);

    const hasContactDetails =
      isFilled(student.email) && isFilled(student.mobile);

    let completion = 0;

    if (hasProfilePic) completion += 30;
    if (hasPersonalDetails) completion += 40;
    if (hasContactDetails) completion += 30;

    /* ===========================
       UPDATE STATUS
    =========================== */

    await CompanyData.findOneAndUpdate(
      { user: userId },
      { completion },
      { returnDocument: "after", upsert: true },
    );

    console.log("Completion:", completion); // ✅ debug
  } catch (error) {
    console.log("Completion Error:", error);
  }
};
