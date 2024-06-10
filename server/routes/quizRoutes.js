import express from "express";
import {
  addQuizResult,
  getAllQuizResults,
  getAllQuizResultsByName,
  getQuizDetailsByUserId,
} from "../controllers/quizControllers.js";

const app = express.Router();

app.post("/add/:id", addQuizResult);
app.get("/quiz-result-by-user/:id", getQuizDetailsByUserId);
app.get("/quiz-all-results", getAllQuizResults);
app.get("/quiz-name-results/:name", getAllQuizResultsByName);

export default app;
