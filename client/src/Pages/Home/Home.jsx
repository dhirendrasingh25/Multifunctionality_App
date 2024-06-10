import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useGetAllQuizResultsQuery, useGetQuizResultsOfUserQuery } from '@/RTK/api';
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend);

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const { data: userQuizResult } = useGetQuizResultsOfUserQuery(user?._id);
  const { data: allQuizResult } = useGetAllQuizResultsQuery();
  // console.log(allQuizResult);

  const [doughnutChartData, setDoughnutChartData] = useState({
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

  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Correct Points',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Wrong Points',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  });

  useEffect(() => {
    if (userQuizResult && userQuizResult.length > 0) {
      const { correct, wrong, total } = userQuizResult[0].quizResult;
      const unanswered = total - (correct + wrong);

      setDoughnutChartData({
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

  useEffect(() => {
    if (allQuizResult && allQuizResult.length > 0) {
      const labels = allQuizResult.map(result => new Date(result.createdAt).toLocaleDateString());
      const correctPointsData = allQuizResult.map(result => result.quizResult.correctPoints);
      const wrongPointsData = allQuizResult.map(result => result.quizResult.wrongPoints);

      setLineChartData({
        labels,
        datasets: [
          {
            label: 'Correct Points',
            data: correctPointsData,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: 'Wrong Points',
            data: wrongPointsData,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      });
    }
  }, [allQuizResult]);

  const doughnutOptions = {
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

  const lineOptions = {
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
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Points',
        },
      },
    },
  };

  return (
    <div className='flex sm:flex-row flex-col items-start  sm:w-full '>
      <div className='py-2 sm:w-full w-[300px]'>
        <h2 className="text-center font-bold mb-4">My First Quiz Results</h2>
        <Doughnut data={doughnutChartData} options={doughnutOptions} />
      </div>
      <div className='py-2 sm:w-full w-[300px]'>
        <h2 className="text-center font-bold mb-4">All Quiz Results Over Time</h2>
        <Line data={lineChartData} options={lineOptions} />
      </div>
    </div>
  );
};

export default Home;
