'use client';

import React from "react";
// Import Bar component which handles both vertical and horizontal with indexAxis option
import { Bar } from "react-chartjs-2"; 
import { 
    Chart as ChartJS, 
    BarElement, 
    CategoryScale, 
    LinearScale, 
    Tooltip, 
    Legend,
    Title,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'; 

// Register all necessary components and plugins
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, ChartDataLabels);

export default function WeeklyRoutineChartHorizontal() {
  const labels = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Data remains ordered chronologically for the 24-hour cycle (12 AM to 12 AM)
  const data = {
    labels,
    datasets: [
      {
        label: "Office Work (12 AM - 8 AM) - Part 1",
        data: [8, 8, 8, 8, 8, 8, 8],
        backgroundColor: "rgba(37, 99, 235, 0.9)", // blue-600
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "Prayer/Prep/Meals (8 AM - 9:30 AM)",
        data: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
        backgroundColor: "rgba(4, 120, 87, 0.9)", // emerald-600
        borderColor: "rgba(4, 120, 87, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "Dedicated Learning (9:30 AM - 1:00 PM)",
        data: [3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5],
        backgroundColor: "rgba(139, 92, 246, 0.9)", // violet-500
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "Free Time/Rest (1:00 PM - 3:30 PM)",
        data: [2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5],
        backgroundColor: "rgba(107, 114, 128, 0.7)", // gray-500
        borderColor: "rgba(107, 114, 128, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "Tuition (3:30 PM - 5:00 PM)",
        data: [1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5],
        backgroundColor: "rgba(245, 158, 11, 0.9)", // amber-500
        borderColor: "rgba(245, 158, 11, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "Free Time/Dinner (5:00 PM - 8:00 PM)",
        data: [3, 3, 3, 3, 3, 3, 3],
        backgroundColor: "rgba(107, 114, 128, 0.7)", // gray-500
        borderColor: "rgba(107, 114, 128, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
      {
        label: "Office Work (8 PM - 12 AM) - Part 2",
        data: [4, 4, 4, 4, 4, 4, 4],
        backgroundColor: "rgba(37, 99, 235, 0.9)", // blue-600
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
        stack: "Stack 0",
      },
    ],
  };

  // Utility function for X-axis (converts 24-hour value to a 12-hour clock time)
  // This will NOT filter any ticks, showing all 24 major hours.
  const hourToClockTime = (hour) => {
    const h = hour % 24;
    if (h === 0 || h === 24) return '12 AM';
    if (h === 12) return '12 PM';
    if (h < 12) return `${h} AM`;
    return `${h - 12} PM`;
  };

  const options = {
    indexAxis: 'y', // KEY CHANGE: Makes the chart horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#000",
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
          display: true,
          text: '24-Hour Weekly Routine Timeline (Horizontal View)', 
          color: '#000',
          font: {
            size: 20,
            weight: 'bold',
          }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        callbacks: {
             // Use the same complex title callback from V3 to show the time range 
             title: (context) => {
                const day = context[0].label;
                const datasetIndex = context[0].datasetIndex;
                const cumulativeStart = data.datasets.slice(0, datasetIndex).reduce((sum, dataset) => sum + dataset.data[0], 0);
                const duration = context[0].parsed.x; // Use parsed.x for horizontal chart
                
                const toClock = (hours) => {
                    const h = Math.floor(hours % 24);
                    const m = Math.round((hours % 1) * 60);
                    const period = h >= 12 ? 'PM' : 'AM';
                    const displayHour = h % 12 || 12;
                    const displayMinutes = m < 10 ? `0${m}` : m;
                    return `${displayHour}:${displayMinutes} ${period}`;
                };

                const startTime = toClock(cumulativeStart);
                const endTime = toClock(cumulativeStart + duration);

                return `${day} Routine: ${startTime} - ${endTime}`;
            },
            label: (context) => {
                const duration = context.parsed.x; // Use parsed.x for horizontal chart
                return `Duration: ${duration} Hours`;
            },
        },
      },
      datalabels: {
        color: '#fff',
        align: 'center',
        anchor: 'center',
        font: {
            weight: 'bold',
            size: 10,
        },
        formatter: (value, context) => {
            if (value >= 1.5) {
                return `${value}h`;
            }
            return '';
        }
      }
    },
    scales: {
      y: { // Y-axis now shows the days (CategoryScale)
        stacked: true,
        ticks: { color: "#000" }, 
        grid: { color: "rgba(255, 255, 255, 0.1)", drawBorder: false }, 
      },
      x: { // X-axis now shows the time (LinearScale)
        stacked: true,
        min: 0,
        max: 24,
        ticks: {
          color: "#000",
          // Show ALL 24 major clock intervals
          stepSize: 1, // Set step size to 1 hour
          callback: (val) => hourToClockTime(val),
        },
        grid: { color: "rgba(255, 255, 255, 0.1)", drawBorder: false }, 
        title: {
            display: true,
            text: 'Time of Day (12 AM to 12 AM)',
            color: '#000',
        }
      },
    },
  };

  return (
    <div className=" flex flex-col justify-center items-center">
      
      <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-indigo-500 mb-10 tracking-wider shadow-lg">
        ➡️ Al Amin’s Horizontal Weekly Routine
      </h2>
      
      <div className="w-full">
        {/* Adjusted height for better horizontal display */}
        <div className="">
             <Bar data={data} options={options} />
        </div>
      </div>

      {/* Summary remains the same */}
      <div className="mt-12 w-full">
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Daily Schedule (Chronological Breakdown)</h3>
          <ul className="text-gray-300 space-y-3">
              <li className="flex justify-between items-center">
                  <span className="font-medium text-blue-400">0. 12:00 AM - 8:00 AM:</span> 
                  <span className="font-bold text-lg">Office Work (Part 1 - 8h)</span>
              </li>
              <li className="flex justify-between items-center">
                  <span className="font-medium text-emerald-400">1. 8:00 AM - 9:30 AM:</span> 
                  <span className="font-bold text-lg">Prayer/Prep/Meals (1.5h)</span>
              </li>
              <li className="flex justify-between items-center">
                  <span className="font-medium text-violet-400">2. 9:30 AM - 1:00 PM:</span> 
                  <span className="font-bold text-lg">Dedicated Learning (3.5h)</span>
              </li>
              <li className="flex justify-between items-center">
                  <span className="font-medium text-gray-400">3. 1:00 PM - 3:30 PM:</span> 
                  <span className="font-bold text-lg">Free Time/Rest (2.5h)</span>
              </li>
              <li className="flex justify-between items-center">
                  <span className="font-medium text-amber-400">4. 3:30 PM - 5:00 PM:</span> 
                  <span className="font-bold text-lg">Tuition (1.5h)</span>
              </li>
              <li className="flex justify-between items-center">
                  <span className="font-medium text-gray-400">5. 5:00 PM - 8:00 PM:</span> 
                  <span className="font-bold text-lg">Free Time/Dinner (3h)</span>
              </li>
              <li className="flex justify-between items-center">
                  <span className="font-medium text-blue-400">6. 8:00 PM - 12:00 AM:</span> 
                  <span className="font-bold text-lg">Office Work (Part 2 - 4h)</span>
              </li>
          </ul>
      </div>

    </div>
  );
}