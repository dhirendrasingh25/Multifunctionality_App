import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

export const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  // httpOnly: true,
  secure: false,
};

export const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "DataBase" })
    .then((data) => console.log(`Connected to DB : ${data.connection.host}`))
    .catch((err) => {
      throw err;
    });
};

export const sendToken = (res, user, code, message) => {
  // console.log("Here");
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  // const token = jwt.sign(user, { expiresIn: "24h" }, process.env.JWT_SECRET);
  // console.log(token);
  return res.status(code).cookie("security-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};

export const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSocket = getSockets(users);
  console.log(
    "io : ",
    io,
    "usersSocket : ",
    usersSocket,
    "event : ",
    event,
    "data : ",
    data
  );
  io.to(usersSocket).emit(event, data);
};

export const getOtherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

export const getSockets = (users = []) => {
  const sockets = users.map((user) => userSocketIDs.get(user.toString()));

  return sockets;
};
