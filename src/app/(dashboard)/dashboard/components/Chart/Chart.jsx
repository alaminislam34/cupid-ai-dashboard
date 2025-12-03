// components/UserGrowthChart.jsx
"use client";

import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

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

/**
 * ইউজারদের জয়েনিং ডেট থেকে মাসিক ক্রমবর্ধমান গ্রোথ (Cumulative Growth) গণনা করে।
 * @param {Array} users - API থেকে আসা ইউজারদের অ্যারে (date_joined ফিল্ড সহ)।
 * @returns {Object} { labels: Array<string>, dataPoints: Array<number> }
 */
const processUserGrowthData = (users) => {
  if (!users || users.length === 0) {
    return { labels: [], dataPoints: [] };
  } // ডেট অনুসারে সর্ট করা

  const sortedUsers = [...users].sort(
    (a, b) => new Date(a.date_joined) - new Date(b.date_joined)
  );

  const growthMap = new Map();
  let cumulativeCount = 0; // ক্রমপুঞ্জিত সংখ্যা গণনা

  sortedUsers.forEach((user) => {
    const joinDate = new Date(user.date_joined); // মাস ও বছর হিসেবে লেবেল (e.g., Nov 2025)
    const monthYear = joinDate.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    cumulativeCount++; // একই মাসের জন্য শেষ মানটিই cumulative count হবে
    growthMap.set(monthYear, cumulativeCount);
  }); // সব লেবেল এবং ডেটা পয়েন্ট অ্যারে তৈরি

  const labels = Array.from(growthMap.keys());
  const dataPoints = Array.from(growthMap.values());

  return { labels, dataPoints };
};

const UserGrowthChart = ({ apiResponse }) => {
  // useMemo ব্যবহার করে ডেটা প্রসেসিং
  const { labels, dataPoints } = useMemo(() => {
    return processUserGrowthData(apiResponse?.users);
  }, [apiResponse]);

  if (dataPoints.length === 0) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-[0px_10px_35px_0px_#00000008] border-2 border-[#ececec] w-full h-[300px] flex items-center justify-center">
               {" "}
        <p className="text-gray-500">
                    No user growth data available to display.        {" "}
        </p>
             {" "}
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "Cumulative Users",
        data: dataPoints,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        fill: "origin",
        tension: 0.4,
        pointRadius: 4, // ডেটা পয়েন্ট দেখানোর জন্য
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#64748b" },
        border: { display: true },
      },
      y: {
        min: 0,
        ticks: {
          color: "#64748b",
          callback: function (value) {
            return value.toLocaleString();
          },
        },
        grid: {
          color: "#f1f5f9",
          borderDash: [5, 5],
          drawBorder: false,
        },
      },
    },
    elements: {
      line: {
        cubicInterpolationMode: "monotone",
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-[0px_10px_35px_0px_#00000008] border-2 border-[#ececec] w-full h-[300px]">
           {" "}
      <h2 className="text-xl font-semibold text-gray-800">
                Monthly Cumulative User Growth      {" "}
      </h2>
           {" "}
      <p className="text-sm text-gray-500 mb-4">
                Users joined up to the current date.      {" "}
      </p>
           {" "}
      <div className="relative h-[calc(100%-60px)]">
                <Line data={chartData} options={options} />     {" "}
      </div>
         {" "}
    </div>
  );
};

export default UserGrowthChart;
