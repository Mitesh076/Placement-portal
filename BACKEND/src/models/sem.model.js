import mongoose from "mongoose";

const semSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    sem1: {
      type: Number,
      required: true,
    },
    sem1b: {
      type: Number,
      required: true,
    },
    sem2: {
      type: Number,
      required: true,
    },
    sem2b: {
      type: Number,
      required: true,
    },
    sem3: {
      type: Number,
      required: true,
    },
    sem3b: {
      type: Number,
      required: true,
    },
    sem4: {
      type: Number,
      required: true,
    },
    sem4b: {
      type: Number,
      required: true,
    },
    sem5: {
      type: Number,
      required: true,
    },
    sem5b: {
      type: Number,
      required: true,
    },
    sem6: {
      type: Number,
      required: true,
    },
    sem6b: {
      type: Number,
      required: true,
    },
    sem7: {
      type: Number,
      required: true,
    },
    sem7b: {
      type: Number,
      required: true,
    },
    sem8: {
      type: Number,
      required: true,
    },
    sem8b: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Sem = mongoose.model("Sem", semSchema);
export default Sem;
