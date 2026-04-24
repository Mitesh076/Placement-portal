import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    profilepic: {
      type: String,
      default: null, // ✅ optional
    },
    name: {
      type: String,
      default: null, // ✅ optional
    },
    gender: {
      type: String,
      enum: ["M", "F", "O", null],
      default: null, // ✅ optional
    },
    branch: {
      type: String,
      enum: ["CE", "IT", null],
      default: null, // ✅ optional
    },
    email: {
      type: String,
      default: null, // ✅ optional
    },
    mobile: {
      type: Number,
      default: null, // ✅ optional
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
