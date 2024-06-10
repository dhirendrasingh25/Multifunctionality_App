import React, { useState } from 'react';
import Quiz from 'react-quiz-component';
import { quiz } from './quizData';
import { Button } from '@/components/ui/button';

const QuizPage = () => {
  const [quizResult, setQuizResult] = useState(null);
  const [showQuiz, setShowQuiz] = useState(true);

  const handleQuizComplete = (result) => {
    console.log('Quiz result:', result);
    const quizSummary = {
      correct: result.numberOfCorrectAnswers,
      wrong: result.numberOfIncorrectAnswers,
      total: result.numberOfQuestions,
      percentage: (result.numberOfCorrectAnswers / result.numberOfQuestions) * 100,
      totalPoints: result.totalPoints,
      correctPoints: result.correctPoints,
    };
    console.log('Quiz summary:', quizSummary);
    setQuizResult(quizSummary);
    setShowQuiz(false); // Hide quiz when done
  };

  const handleResetQuiz = () => {
    setQuizResult(null);
    setShowQuiz(true);
  };

  return (
    <div className='w-full'>
      {showQuiz ? (
        <Quiz quiz={quiz} showDefaultResult={false} onComplete={handleQuizComplete} />
      ) : (
        <>
          {quizResult && (
            <div>
              <h2><strong>Quiz Summary</strong></h2>
              <p><strong>Total Questions:</strong> {quizResult?.total}</p>
              <p><strong>Correct Answers:</strong> {quizResult?.correct}</p>
              <p><strong>Wrong Answers:</strong> {quizResult?.wrong}</p>
              <p><strong>Percentage:</strong> {quizResult?.percentage}%</p>
              <p><strong>Total Points:</strong> {quizResult?.totalPoints}</p>
              <p><strong>Points from Correct Answers:</strong> {quizResult?.correctPoints}</p>
              <Button onClick={handleResetQuiz}>Reset Quiz</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPage;
