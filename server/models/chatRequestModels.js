import mongoose from "mongoose";
const { Schema } = mongoose;

const chatRequestSchema = new Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accepted", "rejected"],
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatRequest = mongoose.model("ChatRequest", chatRequestSchema);

export default ChatRequest;
