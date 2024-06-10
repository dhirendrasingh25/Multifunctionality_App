import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import Quiz from "../models/quizModels.js";

export const addQuizResult = TryCatch(async (req, res) => {
  const {
    correct,
    wrong,
    total,
    percentage,
    totalPoints,
    correctPoints,
    quizName,
  } = req.body;
  console.log(req.user, "user");
  const userId = req.user._id;

  const quiz = await Quiz.create({
    quizResult: {
      correct,
      wrong,
      total,
      percentage,
      totalPoints,
      correctPoints,
    },
    quizName,
    userId,
  });

  res.status(201).json(quiz);
});

export const getQuizDetailsByUserId = TryCatch(async (req, res) => {
  const userId = req.params.id;

  const quizzes = await Quiz.find({ userId });

  if (!quizzes.length) {
    return res.status(404).json({ error: "No quizzes found for this user" });
  }

  res.status(200).json(quizzes);
});

export const getAllQuizResults = TryCatch(async (req, res, next) => {
  const quizzes = await Quiz.find();
  if (!users) return next(new ErrorHandler("No Users Found", 404));
  res.status(200).json(quizzes);
});

export const getAllQuizResultsByName = TryCatch(async (req, res, next) => {
  const quizName = req.params.name;
  const quizzes = await Quiz.find({ quizName });
  if (!quizzes.length) {
    return res.status(404).json({ error: "No quizzes found with this name" });
  }

  res.status(200).json(quizzes);
});
