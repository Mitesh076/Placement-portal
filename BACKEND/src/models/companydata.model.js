import mongoose from "mongoose";

const companydataSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    completion: {
      type: Number,
      required: true,
    },

    visited: {
      type: Boolean,
      default: false,
      required: true,
    },

    verified: {
      type: String,
      enum: ["Verified", "Unverified", "Rejected", "Pending"],
      default: "Unverified",
      required: true,
    },
  },
  { timestamps: true },
);

const CompanyData =
  mongoose.models.CompanyData ||
  mongoose.model("CompanyData", companydataSchema);

export default CompanyData;
