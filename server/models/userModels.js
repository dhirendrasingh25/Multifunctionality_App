import mongoose from "mongoose";
const { Schema } = mongoose;
import { hash } from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: Number,
      unique: true,
    },
    wallet: {
      type: Number,
    },
    password: {
      type: String,
      select: false,
    },
    about: {
      type: String,
    },
    chatLog: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    callLog: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    userType: {
      type: String,
      default: "User",
      enum: ["User", "Counsellor"],
    },
    registerType: {
      type: String,
      default: "email",
      enum: ["email", "google"],
    },
    earning: {
      type: Number,
    },
    about: {
      type: String,
    },
    online: {
      type: Boolean,
    },
    promoCode: [
      {
        type: Schema.Types.ObjectId,
        ref: "PromoCode",
      },
    ],
    profile: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await hash(this.password, 8);
});

const User = mongoose.model("User", userSchema);

export default User;
