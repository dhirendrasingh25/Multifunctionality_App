import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    message: { String },
    reciever: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
