import mongoose from "mongoose";
const { Schema } = mongoose;

const quizSchema = new Schema(
  {
    quizResult: {
      correct: {
        type: Number,
        required: true,
      },
      wrong: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
      percentage: {
        type: Number,
        required: true,
      },
      totalPoints: {
        type: Number,
        required: true,
      },
      correctPoints: {
        type: Number,
        required: true,
      },
    },
    quizName: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
