// Modules Imports
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//Routes Imports
import userRoutes from "./routes/userRoutes.js";

// Utils Imports
import { connectDB } from "./utils/features.js";

// App Configs
const app = express();
dotenv.config({
  path: "./.env",
});

// env Constants
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT;
export const envMode = process.env.NODE_ENV;

connectDB(mongoURI);

// Using Middlewares Here
app.use(express.json());

app.use(cookieParser());

// Using Routes
app.use("/user", userRoutes);

// Server
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
