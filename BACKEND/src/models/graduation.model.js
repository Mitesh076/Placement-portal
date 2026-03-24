import mongoose from "mongoose";

const graduationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    course: {
      type: String,
      enum: ["BE", "BTECH", "D2D"],
      default: "BE",
      required: true,
    },
    branch: {
      type: String, // cloudinary
      enum: ["CE", "IT", "FPT"],
      default: "IT",
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    ccgpa: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Graduation = mongoose.model("Graduation", graduationSchema);
export default Graduation;
