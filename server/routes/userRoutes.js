import express from "express";
import {
  login,
  newUser,
  logout,
  googleLogin,
} from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
const app = express.Router();

app.post("/login", login);
app.post("/google-login", googleLogin);
app.post("/new", newUser);

// After here user must be logged in to access the routes

app.use(isAuthenticated);
app.get("/logout", logout);

export default app;
