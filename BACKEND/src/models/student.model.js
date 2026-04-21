import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
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
    erno: {
      type: Number,
      required: true,
      uniqe: true,
    },

    gender: {
      type: String,
      enum: ["M", "F", "O"],
      required: true,
    },
    branch: {
      type: String,
      enum: ["CE", "IT"],
      required: true,
    },
    sem: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8],
      required: true,
    },
    cgpa: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      uniqe: true,
      required: true,
    },
    mobile: {
      type: Number,
      uniqe: true,
      required: true,
      maxlength: 10,
    },
    batch: {
      type: Number,
    },
  },
  { timestamps: true },
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
