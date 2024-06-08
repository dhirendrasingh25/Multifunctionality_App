import express from "express";
import {
  login,
  newUser,
  logout,
  googleLogin,
  getProfile,
  getAllUsers,
  addFriend,
  getFriendNames,
} from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
const app = express.Router();

app.post("/login", login);
app.post("/google-login", googleLogin);
app.post("/new", newUser);
app.get("/profile/:id", getProfile);
// After here user must be logged in to access the routes

// app.use(isAuthenticated);
app.get("/logout", logout);
app.get("/all-users", getAllUsers);
app.post("/add-friend", addFriend);
app.get("/get-friends/:id", getFriendNames);

export default app;
