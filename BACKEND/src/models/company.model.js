import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    profilepic: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    industry: {
      type: String,
      default: null,
    },
    website: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    hrname: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
      sparse: true,
      unique: true,
    },
    description: {
      type: String,
      default: null,
    },
    mobile: {
      type: Number,
      default: null,
      sparse: true,
      unique: true,
    },
    sappeared: {
      type: Number,
      default: null,
    },
    splaced: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);
const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);
export default Company;
