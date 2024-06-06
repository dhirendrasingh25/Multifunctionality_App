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
    age: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      select: false,
    },
    chatLog: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    registerType: {
      type: String,
      default: "email",
      enum: ["email", "google"],
    },
    location: {
      type: String,
    },
    online: {
      type: Boolean,
    },
    profile: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
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
