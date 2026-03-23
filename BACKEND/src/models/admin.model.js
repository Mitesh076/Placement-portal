import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    profilepic: {
      type: String,
      require: true, // cloudinary
    },
    name: {
      type: String,
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
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
      unique: true,
      maxlength: 10,
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
