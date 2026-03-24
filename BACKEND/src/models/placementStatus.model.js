import mongoose from "mongoose";

const placementStatusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
      unique: true,
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
  },
  { timestamps: true },
);

const PlacementStatus = mongoose.model(
  "PlacementStatus",
  placementStatusSchema,
);
export default PlacementStatus;
