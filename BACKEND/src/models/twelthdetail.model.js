import mongoose from "mongoose";

const twelthdetailSchema = new mongoose.Schema(
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
    stream: {
      type: String, // cloudinary
      required: true,
    },
    percentage: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },

    school: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Twelthdetail = mongoose.model("Twelthdetail", twelthdetailSchema);
export default Twelthdetail;
