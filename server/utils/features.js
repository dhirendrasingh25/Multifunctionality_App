import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

export const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
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
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res.status(code).cookie("security-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};
