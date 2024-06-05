import User from "../models/userModels.js";
import { sendToken, cookieOptions } from "../utils/features.js";
import { compare } from "bcrypt";
import { ErrorHandler } from "../utils/utility.js";

import { TryCatch } from "../middlewares/error.js";

export const newUser = TryCatch(async (req, res, next) => {
  const { name, email, password, promo } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    promo,
  });

  sendToken(res, user, 201, "User created Successfully");
});

export const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Email or Password", 404));

  const isMatch = await compare(password, user.password);

  if (!isMatch)
    return next(new ErrorHandler("Invalid Username or Password", 404));

  sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

export const googleLogin = TryCatch(async (req, res, next) => {
  const { email, name, profile } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const newUser = await User.create({
      name,
      email,
      profile,
      registerType: "google",
    });
    sendToken(res, newUser, 200, `Welcome , ${user.name}`);
  } else {
    sendToken(res, user, 200, `Welcome , ${user.name}`);
  }
});

export const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("security-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
