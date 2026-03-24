import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    jobRole: {
      type: String,
      required: true,
    },

    rounds: [
      {
        name: {
          type: String, // Aptitude, Technical, HR
        },

        status: {
          type: String,
          default: "Pending", // Pending, Cleared, Failed
        },
      },
    ],

    result: {
      type: String,
      default: "In Progress", // Selected, Rejected, In Progress
    },
  },
  { timestamps: true },
);

// Prevent duplicate entry (same student + same company)
interviewSchema.index({ studentId: 1, company: 1 }, { unique: true });

export default mongoose.model("Interview", interviewSchema);
