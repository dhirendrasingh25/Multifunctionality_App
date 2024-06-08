import User from "../models/userModels.js";
import { sendToken, cookieOptions } from "../utils/features.js";
import { compare } from "bcrypt";
import { ErrorHandler } from "../utils/utility.js";

import { TryCatch } from "../middlewares/error.js";

export const newUser = TryCatch(async (req, res, next) => {
  const { name, email, password, age, location } = req.body;
  // console.log(req.body);
  const user = await User.create({
    name,
    email,
    password,
    age,
    location,
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

export const getProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // console.log(user);
  if (!user) return next(new ErrorHandler("User not found", 404));
  sendToken(res, user, 200, `Welcome , ${user.name}`);
});

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find();
  // console.log(users);
  if (!users) return next(new ErrorHandler("No Users Found", 404));
  res.status(200).json({
    success: true,
    users,
  });
});

export const addFriend = TryCatch(async (req, res, next) => {
  const { userId, friendId } = req.body;

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) return next(new ErrorHandler("User not found", 404));

  if (user.friends.includes(friendId) || friend.friends.includes(userId))
    return next(new ErrorHandler("Already Friends", 400));

  user.friends.push(friendId);
  friend.friends.push(user);

  await user.save();
  await friend.save();

  res.status(200).json({
    success: true,
    message: "Friend added successfully",
  });
});

export const getFriendNames = TryCatch(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId).populate("friends._id", "name");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const friendNames = user.friends.map((friend) => friend._id.name);
  console.log(friendNames);
  res.status(200).json({
    success: true,
    friendNames,
  });
});
