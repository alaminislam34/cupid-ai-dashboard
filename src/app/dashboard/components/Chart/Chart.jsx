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
  Filler,
);

// Aggregate counts per period (monthly or daily) for a given date field
const aggregateCounts = (
  items,
  dateField = "date_joined",
  period = "monthly",
) => {
  if (!items || items.length === 0) return { labels: [], dataPoints: [] };

  const counts = new Map();

  items.forEach((it) => {
    const raw = it[dateField];
    if (!raw) return;
    const d = new Date(raw);

    let key;
    if (period === "daily") {
      key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    } else {
      key = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }

    counts.set(key, (counts.get(key) || 0) + 1);
  });

  // Sort keys chronologically
  const entries = Array.from(counts.entries()).sort(
    (a, b) => new Date(a[0]) - new Date(b[0]),
  );
  const labels = entries.map((e) => e[0]);
  const dataPoints = entries.map((e) => e[1]);

  return { labels, dataPoints };
};

// Fallback cumulative monthly growth
const processCumulativeMonthly = (items, dateField = "date_joined") => {
  if (!items || items.length === 0) return { labels: [], dataPoints: [] };

  const sorted = [...items].sort(
    (a, b) => new Date(a[dateField]) - new Date(b[dateField]),
  );
  const growthMap = new Map();
  let cumulative = 0;

  sorted.forEach((it) => {
    const d = new Date(it[dateField]);
    const key = d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    cumulative++;
    growthMap.set(key, cumulative);
  });

  return {
    labels: Array.from(growthMap.keys()),
    dataPoints: Array.from(growthMap.values()),
  };
};

const UserGrowthChart = ({ totalUsers, totalBots }) => {
  // Decide which data to show
  const { labels, dataPoints, title } = useMemo(() => {
    // If user activity has `last_login`, show monthly user logins
    if (totalUsers?.users && totalUsers.users.some((u) => u.last_login)) {
      const res = aggregateCounts(totalUsers.users, "last_login", "monthly");
      return {
        labels: res.labels,
        dataPoints: res.dataPoints,
        title: "Monthly User Logins",
      };
    }

    // Else if bots data exists, show daily bot creations
    if (totalBots?.bots && totalBots.bots.length > 0) {
      const res = aggregateCounts(totalBots.bots, "created_at", "daily");
      return {
        labels: res.labels,
        dataPoints: res.dataPoints,
        title: "Daily Bot Creations",
      };
    }

    // Else fallback to cumulative monthly user growth
    if (totalUsers?.users) {
      const res = processCumulativeMonthly(totalUsers.users, "date_joined");
      return {
        labels: res.labels,
        dataPoints: res.dataPoints,
        title: "Monthly Cumulative User Growth",
      };
    }

    return { labels: [], dataPoints: [], title: "Growth" };
  }, [totalUsers, totalBots]);

  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-[0px_10px_35px_0px_#00000008] border-2 border-[#ececec] w-full h-75 flex items-center justify-center">
        <p className="text-gray-500">No growth data available to display.</p>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data: dataPoints,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.08)",
        fill: "origin",
        tension: 0.35,
        pointRadius: 4,
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
    <div className="p-4 bg-white rounded-xl shadow-[0px_10px_35px_0px_#00000008] border-2 border-[#ececec] w-full h-75">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500 mb-4">{title}</p>
      <div className="relative h-[calc(100%-60px)]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default UserGrowthChart;
