import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    profilepic: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    erno: {
      type: Number,
      default: null,
      sparse: true, // ✅ allows multiple null values on unique field
      unique: true,
    },
    gender: {
      type: String,
      enum: ["M", "F", "O", null],
      default: null,
    },
    branch: {
      type: String,
      enum: ["CE", "IT", null],
      default: null,
    },
    sem: {
      type: Number,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, null],
      default: null,
    },
    cgpa: {
      type: Number,
      default: null,
    },
    email: {
      type: String,
      default: null,
      sparse: true, // ✅ allows multiple null on unique field
      unique: true,
    },
    mobile: {
      type: Number,
      default: null,
      sparse: true,
      unique: true,
    },
    batch: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true },
);

const Student = mongoose.model("Student", studentSchema);
export default Student;
