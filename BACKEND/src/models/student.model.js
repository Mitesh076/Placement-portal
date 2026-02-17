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
    },
    dob: {
      type: Date,
      required: true,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
      maxlength: 10,
      minlength: 10,
    },
    altmobile: {
      type: Number,
      maxlength: 10,
      minlength: 10,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    addressline1: {
      type: String,
      required: true,
    },
    addressline2: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
      maxlength: 6,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const Student = mongoose.model("Student", studentSchema);
