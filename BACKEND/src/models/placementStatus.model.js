import mongoose from "mongoose";

const placementStatusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    status: {
      type: String,
      enum: ["Placed", "Unplaced"],
      default: "Unplaced",
    },

    verified: {
      type: String,
      enum: ["Verified", "Unverified", "Pending", "Rejected"],
      default: "Unverified",
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
