import mongoose from "mongoose";

const appliedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cname: {
      type: String,
      require: true, // cloudinary
    },
    role: {
      type: String,
      required: true, // cloudinary
    },
    appliedon: {
      type: Date,
      required: true,
    },
    nextroundon: {
      type: Date,
      required: true, // cloudinary
    },
    round: {
      type: String,
      required: true, // cloudinary
    },
    nextround: {
      type: String,
      required: true, // cloudinary
    },
    progress: {
      type: Number,
      required: true, // cloudinary
    },

    status: {
      type: String,
      enum: ["Applied", "Selected", "Rejected", "Shortlisted", "Pending"],
      required: true,
    },
  },
  { timestamps: true },
);

const Applied = mongoose.model("Applied", appliedSchema);
export default Applied;
