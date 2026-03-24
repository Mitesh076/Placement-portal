import mongoose from "mongoose";

const tenthdetailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    board: {
      type: String, // cloudinary
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },

    school: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Tenthdetail = mongoose.model("Tenthdetail", tenthdetailSchema);
export default Tenthdetail;
