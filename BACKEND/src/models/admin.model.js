import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    profilepic: {
      type: String, // cloudinary
    },
    name: {
      type: String,
      required: true,
    },
    adminid: {
      type: Number,
      required: true,
      unique: true,
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
    email: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moblie: {
      type: Number,
      required: true,
      unique: true,
      maxlength: 10,
    },
    altmoblie: {
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

export const Admin = mongoose.model("Admin", adminSchema);
