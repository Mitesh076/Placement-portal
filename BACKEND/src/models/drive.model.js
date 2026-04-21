import mongoose from "mongoose";

const driveSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    roles: {
      type: String,
      required: true,
    },
    pack: {
      type: Number,
      required: true,
    },
    ebranches: {
      type: String,
      required: true,
    },
    drivedate: {
      type: Date,
      required: true,
    },
    jobtype: {
      type: String,
      enum: ["Part-time", "Full-time", "Internship"],
      default: "Part-time",
      required: true,
    },
    mincgpa: {
      type: Number,
      required: true,
    },
    bond: {
      type: String,
      required: true,
    },
    lastdate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const Drive = mongoose.model("Drive", driveSchema);
export default Drive;
