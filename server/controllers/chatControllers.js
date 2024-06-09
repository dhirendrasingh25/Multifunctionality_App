import Chat from "../models/chatModels.js";
import { TryCatch } from "../middlewares/error.js";
import { getReceiverSocketId, ioInstance } from "../app.js";
import Message from "../models/messageModels.js";
import mongoose from "mongoose";

export const sendMessage = TryCatch(async (req, res) => {
  try {
    // console.log(req.body);
    const { message } = req.body;

    // console.log(message, "mess here");

    const { id } = req.params;
    // console.log(req.params.id, "id req params here");
    // console.log(id, "niu id hai");
    const receiver = id; // Convert receiver to ObjectId
    // console.log(req.body);
    const { sender } = req.body;
    // console.log(sender, "seder id here");
    // console.log(receiver, "reciever id here"); // Convert sender to ObjectId

    let conversation = await Chat.findOne({
      members: { $all: [sender, receiver] },
    });

    // console.log(conversation, "heresd");
    if (!conversation) {
      conversation = await Chat.create({
        members: [sender, receiver],
      });
    }
    // console.log(message, "message here");
    // console.log(sender, receiver, message, "sender receiver message");
    const newMessage = new Message({
      sender,
      reciever: receiver,
      message,
    });

    // console.log(newMessage, "new message here");
    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    // console.log("here");
    // Save the conversation and the new message in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY
    const receiverSocketId = getReceiverSocketId(receiver);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      ioInstance.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
export const getMessages = TryCatch(async (req, res) => {
  try {
    const userToChatId = req.params.rid;
    // console.log(req.user);
    const sender = req.params.sid;

    // console.log(userToChatId, sender);
    const conversation = await Chat.findOne({
      members: { $all: [sender, userToChatId] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
