"use client";

import React from "react";

export default function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-100 to-pink-100 p-4">
      <div className="flex flex-col items-center p-8 md:p-12 bg-white rounded-3xl shadow-2xl transition-all duration-500 w-full max-w-sm">
        <div className="relative mb-6">
          <div
            className="w-16 h-16 border-4 border-dashed border-t-purple-500 border-r-indigo-500 border-b-pink-500 border-l-gray-200 rounded-full animate-spin-slow"
            style={{ animationDuration: "2s" }}
          ></div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-3xl" role="img" aria-label="loading-emoji">
              😊
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Loading Page Content...
        </h2>
        <p className="text-base text-gray-500 text-center">
          Please wait a moment. We're preparing your data.
        </p>

        <div className="mt-6 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#FB665B] to-[#8951D5] rounded-full"
            style={{ width: "80%", transition: "width 2s" }}
          ></div>
        </div>
        <p className="text-xs text-purple-600 mt-2 font-medium animate-pulse">
          Fetching resources...
        </p>
      </div>
    </div>
  );
}
