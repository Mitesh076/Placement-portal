import mongoose from "mongoose";

const placementOffersSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    cname: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    pack: {
      type: Number,
      required: true,
    },

    bond: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    choice: {
      type: String,
      enum: ["Accepted", "Rejected", "Pending"],
      required: true,
    },
  },
  { timestamps: true },
);

const PlacementOffers = mongoose.model(
  "PlacementOffers",
  placementOffersSchema,
);
export default PlacementOffers;
