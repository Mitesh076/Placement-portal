import mongoose from "mongoose";
const appliedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    cname: String,
    role: String,

    // ✅ STATUS
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Selected", "Rejected"],
      default: "Applied",
    },

    // ✅ ROUNDS SYSTEM
    totalRounds: {
      type: Number,
      default: 4,
    },

    roundsCleared: {
      type: Number,
      default: 0,
    },

    // ✅ NEXT ROUND INFO
    nextround: {
      type: String,
      default: null,
    },

    nextroundon: {
      type: Date,
      default: null,
    },

    appliedon: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// ✅ prevent duplicate apply
appliedSchema.index({ user: 1, drive: 1 }, { unique: true });

export default mongoose.model("Applied", appliedSchema);
