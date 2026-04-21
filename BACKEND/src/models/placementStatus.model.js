import mongoose from "mongoose";

const placementStatusSchema = new mongoose.Schema(
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
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    status: {
      type: String,
      enum: ["Placed", "Unplaced"],
      default: "Unplaced",
      required: true,
    },

    verified: {
      type: String,
      enum: ["Verified", "Unverified"],
      default: "Unverified",
      required: true,
    },
    eligible: {
      type: Number,
      required: true,
    },
    applied: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    completion: {
      type: Number,
      required: true,
    },

    pcname: {
      type: String,
    },

    pack: {
      type: Number,
    },
  },
  { timestamps: true },
);

const PlacementStatus = mongoose.model(
  "PlacementStatus",
  placementStatusSchema,
);
export default PlacementStatus;
