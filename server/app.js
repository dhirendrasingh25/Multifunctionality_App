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
app.use(errorMiddleware);

// Socket.io

io.on("connection", (socket) => {
  console.log("User Connected : ", socket.id);
  const user = socket?.user;
  console.log("User : ", user);
  userSocketIDs.set(user?._id.toString(), socket.id);

  socket.on("message", async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user?._id,
        name: user?.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user?._id,
      chat: chatId,
    };

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit("message", {
      chatId,
      message: messageForRealTime,
    });
    io.to(membersSocket).emit("message-alert", { chatId });

    console.log("Message : ", messageForDB);
    try {
      await Message.create(messageForDB);
    } catch (error) {
      throw new Error(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected : ", socket.id);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected : ", userSocketIDs);
    userSocketIDs.delete(user?._id.toString());
  });

  // socket.on("join-room", (data) => {
  //   // console.log(data.roomName);
  //   socket.join(data.roomName);
  //   console.log("Room Joined : ", data.roomName);
  // });
});

// Server
server.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
