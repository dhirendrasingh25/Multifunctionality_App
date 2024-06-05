import mongoose from "mongoose";
const { Schema } = mongoose;

const adminSchema = new Schema(
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
    salary: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    designation: {
      type: String,
    },
    Log: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    userType: {
      type: String,
      default: "Admin",
      enum: ["Admin", "SuperAdmin"],
    },
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

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
