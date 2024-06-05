import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

const promoCodeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    usability: {
      type: Boolean,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

export default PromoCode;
