import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    profilepic: {
      type: String, // cloudinary
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    hrname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const Company = mongoose.model("Company", companySchema);
export default Company;
