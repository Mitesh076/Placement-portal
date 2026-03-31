import Company from "../models/company.model.js";
import { uploadFile } from "../Services/company.storage.service.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import CompanyData from "../models/companydata.model.js";

async function companyProfile(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized user" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (decoded.role !== "company") {
      return res
        .status(403)
        .json({ message: "You dont have access to use the Company profile " });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Profile image is required" });
    }
    const {
      name,
      industry,
      website,
      location,
      hrname,
      description,
      hremail,
      mobile,
    } = req.body;

    // Check duplicate email
    const existingEmail = await Company.findOne({ hremail });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // (Optional) Check mobile too
    const existingMobile = await Company.findOne({ mobile });
    if (existingMobile) {
      return res.status(400).json({
        message: "Mobile number already exists",
      });
    }

    const result = await uploadFile(file.buffer.toString("base64"));

    const company = await Company.create({
      profilepic: result.url,
      user: decoded.id,
      name,
      industry,
      website,
      location,
      hrname,
      description,
      mobile,
      hremail: hremail || user.email,
    });

    return res.status(201).json({
      message: "Company profile Created successfully ",
      company: {
        id: company._id,
        profilepic: company.profilepic,
        user: company.user,
        name: company.name,
        industry: company.industry,
        website: company.website,
        location: company.location,
        hrname: company.hrname,
        description: company.description,
        mobile: company.mobile,
        hremail: company.hremail,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate data not allowed",
      });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
}

// ✅ GET ALL COMPANIES FOR VERIFICATION
export const getVerificationCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    const verifications = await CompanyData.find();

    // 🔥 Map for fast lookup
    const verificationMap = {};
    verifications.forEach((v) => {
      verificationMap[v.company?.toString()] = v;
    });

    const merged = companies.map((company) => {
      const verification = verificationMap[company._id.toString()];

      return {
        _id: company._id,
        companyId: company.companyId || company._id,
        name: company.name,
        industry: company.industry,
        location: company.location,

        // ✅ IMPORTANT FIX
        status: verification?.verified === "Verified" ? "Verified" : "Unverified",
      };
    });

    console.log("Companies:", verifications);
    res.status(200).json(merged);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const updateCompanyVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    let record = await CompanyData.findOne({ company: id });

    if (!record) {
      // create if not exists
      record = new CompanyData({
        company: id,
        status,
      });
    } else {
      record.status = status;
    }

    await record.save();

    res.json({ message: "Company status updated", record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default { companyProfile };
