import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useGetAllQuizResultsQuery, useGetQuizResultsOfUserQuery } from '@/RTK/api';
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: userQuizResult } = useGetQuizResultsOfUserQuery(user?._id);
  const {data: allQuizResult} = useGetAllQuizResultsQuery()
  console.log(allQuizResult);

 const [chartData, setChartData] = useState({
    labels: ['Correct', 'Wrong', 'Unanswered'],
    datasets: [
      {
        label: 'Quiz Results',
        data: [0, 0, 0], // Initial data
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)', // Light green for correct answers
          'rgba(255, 99, 132, 0.2)', // Light red for wrong answers
          'rgba(255, 206, 86, 0.2)', // Light yellow for unanswered
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)', // Dark green for correct answers
          'rgba(255, 99, 132, 1)', // Dark red for wrong answers
          'rgba(255, 206, 86, 1)', // Dark yellow for unanswered
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    if (userQuizResult && userQuizResult.length > 0) {
      const { correct, wrong, total } = userQuizResult[0].quizResult;
      const unanswered = total - (correct + wrong);

      setChartData({
        labels: ['Correct', 'Wrong', 'Unanswered'],
        datasets: [
          {
            label: 'Quiz Results',
            data: [correct, wrong, unanswered],
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)', // Light green for correct answers
              'rgba(255, 99, 132, 0.2)', // Light red for wrong answers
              'rgba(255, 206, 86, 0.2)', // Light yellow for unanswered
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)', // Dark green for correct answers
              'rgba(255, 99, 132, 1)', // Dark red for wrong answers
              'rgba(255, 206, 86, 1)', // Dark yellow for unanswered
            ],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [userQuizResult]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <div>
    <div className='w-1/2'>
      <h2 className="text-center font-bold mb-4">My First Quiz Results</h2>
      <Doughnut data={chartData} options={options} />
    </div>
    <div>

    </div>
    </div>
  );
};

export default Home;
