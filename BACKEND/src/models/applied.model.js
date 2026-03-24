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
      require: true, // cloudinary
    },
    appliedon: {
      type: Date,
      required: true,
    },
    nextroundon: {
      type: Date,
      require: true, // cloudinary
    },
    round: {
      type: String,
      require: true, // cloudinary
    },
    nextround: {
      type: String,
      require: true, // cloudinary
    },
    progress: {
      type: Number,
      require: true, // cloudinary
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
