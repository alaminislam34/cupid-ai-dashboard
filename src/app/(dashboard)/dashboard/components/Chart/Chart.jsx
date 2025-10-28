// components/UserGrowthChart.jsx
'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Needed for the shaded area
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const UserGrowthChart = () => {
  // --- 1. DATA (Mimicking the visual) ---
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

  // Approximate data points based on the image's curve
  const dataPoints = [60, 120, 75, 160, 680, 700, 800];

  const chartData = {
    labels,
    datasets: [
      {
        data: dataPoints,
        borderColor: '#22c55e', // A bright green, or a custom Tailwind color
        backgroundColor: 'rgba(34, 197, 94, 0.1)', // Light, semi-transparent shade for the fill
        fill: 'origin', // Fill area under the line
        tension: 0.4, // Smooth curve
        pointRadius: 0, // No points visible on the line
        borderWidth: 2,
      },
    ],
  };

  // --- 2. OPTIONS (Styling and Configuration) ---
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows you to control the size with Tailwind
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide vertical grid lines
        },
        ticks: {
          color: '#64748b', // Text color for labels (slate-500)
          font: {
            size: 12,
          },
        },
        border: {
          display: false, // Hide the x-axis line
        },
      },
      y: {
        min: 10, // Start y-axis close to the bottom
        // Custom tick values to match the chart's labels (10, 50, 150, 500, 1k+)
        ticks: {
          color: '#64748b', // Text color for labels (slate-500)
          stepSize: 100, // This is hard to match exactly, so we'll use a callback
          callback: function (value) {
            if (value === 10) return '10';
            if (value === 50) return '50';
            if (value === 150) return '150';
            if (value === 500) return '500';
            if (value === 1000) return '1k+'; // Custom label for the top
            return null; // Hide other labels
          },
          font: {
            size: 12,
          },
        },
        grid: {
          color: '#f1f5f9', // Light gray color for horizontal grid lines (slate-100)
          borderDash: [5, 5], // Dashed lines
          drawBorder: false, // Hide the y-axis line
        },
      },
    },
    elements: {
      line: {
        // Use a slight curve for the line
        cubicInterpolationMode: 'monotone',
      },
    },
  };

  // --- 3. RENDER ---
  return (
    <div className="p-4 bg-white rounded-xl shadow-[0px_10px_35px_0px_#00000008] border-2 border-[#ececec] w-full h-[300px]">
      <h2 className="text-xl font-semibold text-gray-800">Monthly User Growth</h2>
      <p className="text-sm text-gray-500 mb-4">Overall users join over the past year</p>
      {/* Chart container with a defined height */}
      <div className="relative h-[calc(100%-60px)]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default UserGrowthChart;