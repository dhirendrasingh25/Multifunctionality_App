// Modules Imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOptions } from "./constants/config.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { getOtherMember, getSockets } from "./utils/features.js";
import Message from "./models/messageModels.js";
import { v4 as uuid } from "uuid";
//Routes Imports
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// Utils Imports
import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";

// App Configs
const app = express();
const server = new createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

dotenv.config({
  path: "./.env",
});

// env Constants
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;
export const envMode = process.env.NODE_ENV;
export const userSocketIDs = new Map();
connectDB(mongoURI);

// Using Middlewares Here
app.set("io", io);

export const ioInstance = io;
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Using Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use(errorMiddleware);

// Socket.io

// io.on("connection", (socket) => {
//   console.log("User Connected : ", socket.id);
//   const user = socket?.user;
//   console.log("User : ", user);
//   userSocketIDs.set(user?._id.toString(), socket.id);

//   socket.on("message", async ({ chatId, members, message }) => {
//     const messageForRealTime = {
//       content: message,
//       _id: uuid(),
//       sender: {
//         _id: user?._id,
//         name: user?.name,
//       },
//       chat: chatId,
//       createdAt: new Date().toISOString(),
//     };

//     const messageForDB = {
//       content: message,
//       sender: user?._id,
//       chat: chatId,
//     };

//     const membersSocket = getSockets(members);
//     io.to(membersSocket).emit("message", {
//       chatId,
//       message: messageForRealTime,
//     });
//     io.to(membersSocket).emit("message-alert", { chatId });

//     console.log("Message : ", messageForDB);
//     try {
//       await Message.create(messageForDB);
//     } catch (error) {
//       throw new Error(error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected : ", socket.id);
//   });
//   socket.on("disconnect", () => {
//     console.log("User Disconnected : ", userSocketIDs);
//     userSocketIDs.delete(user?._id.toString());
//   });

//   // socket.on("join-room", (data) => {
//   //   // console.log(data.roomName);
//   //   socket.join(data.roomName);
//   //   console.log("Room Joined : ", data.roomName);
//   // });
// });
export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("user connected :", socket.id);
  // socket.on("message", (data) => {
  //   if (!data.room)
  //     return socket.broadcast.emit("recieve-message", data.message);
  //   // socket.broadcast.emit("recieved-message", data) sends to all except sender;
  //   io.to(data.room).emit("recieve-message", data.message);
  // });

  // socket.on("disconnect", () => {
  //   console.log("User Disconnected : ", socket.id);
  // });

  const userId = socket.handshake.query.userId;
  // console.log(userId, "userId");
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // socket.on() is used to listen to the events. can be used both on client and server side
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Server
server.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
