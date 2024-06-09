import express from "express";
import { getMessages, sendMessage } from "../controllers/chatControllers.js";

const app = express.Router();

app.get("/:rid/:sid", getMessages);
app.post("/send/:id", sendMessage);

export default app;
