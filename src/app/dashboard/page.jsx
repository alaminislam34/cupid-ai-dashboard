"use client";
import React, { useState, useMemo } from "react";
import { HiUsers } from "react-icons/hi2";
import { RiRobot3Line } from "react-icons/ri";
import { HiOutlineInboxIn } from "react-icons/hi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import UserGrowthChart from "./components/Chart/Chart";
import { useAuth } from "@/provider/authProvider";

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { totalBots, totalUsers } = useAuth();

  // Normalize users list coming from the auth provider
  const usersArray = Array.isArray(totalUsers)
    ? totalUsers
    : totalUsers?.users || [];

  const totalPages = Math.ceil((usersArray.length || 0) / ITEMS_PER_PAGE) || 1;

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return usersArray.slice(start, end);
  }, [currentPage, usersArray]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const overviews = [
    {
      title: "Total Users",
      value: totalUsers?.total_users || 0,
      icon: <HiUsers className="text-2xl text-white" />,
    },
    {
      title: "Total Created Bots",
      value: totalBots?.total_bots || 0,
      icon: <RiRobot3Line className="text-2xl text-white" />,
    },
    {
      title: "Total Subscribers",
      value: 0,
      icon: <HiOutlineInboxIn className="text-2xl text-white" />,
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl lg:text-4xl font-bold text-[#1D1B20]">
        Dashboard Overview
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {overviews.map(({ title, value, icon }, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow space-y-4"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-base lg:text-lg font-medium text-gray-600">
                {title}
              </h4>
              <span className="p-2.5 bg-gray-400 rounded-full">{icon}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
              {value}
            </h1>
          </div>
        ))}
      </div>

      {/* User Table Section */}
      <div className="bg-white rounded-2xl border border-[#B9DAFE] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#EAF7FF] text-gray-700 font-semibold uppercase">
              <tr>
                <th className="py-4 px-6 border-b border-[#B9DAFE]">Name</th>
                <th className="py-4 px-6 border-b border-[#B9DAFE]">
                  Username
                </th>
                <th className="py-4 px-6 border-b border-[#B9DAFE]">Age</th>
                <th className="py-4 px-6 border-b border-[#B9DAFE]">Gender</th>
                <th className="py-4 px-6 border-b border-[#B9DAFE]">
                  Subscription
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B9DAFE]">
              {currentItems.map((user, i) => (
                <tr
                  key={user.id ?? i}
                  className={`${i % 2 === 1 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50/50 transition-colors`}
                >
                  {/* Name */}
                  <td className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap border-r border-[#B9DAFE]">
                    {user.full_name || user.name || "-"}
                  </td>

                  {/* Username (fallback to local-part of email) */}
                  <td className="py-4 px-6 border-r border-[#B9DAFE]">
                    {user.username ||
                      (user.email ? user.email.split("@")[0] : "-")}
                  </td>

                  {/* Age */}
                  <td className="py-4 px-6 border-r border-[#B9DAFE]">
                    {user.age ?? "-"}
                  </td>

                  {/* Gender */}
                  <td className="py-4 px-6 border-r border-[#B9DAFE]">
                    {user.gender || "-"}
                  </td>

                  {/* Available Info: list which fields are present in the data */}
                  <td className="py-4 px-6">
                    {(() => {
                      const available = [];
                      if (user.full_name || user.name) available.push("Name");
                      if (user.username || user.email)
                        available.push("Username/Email");
                      if (user.age !== null && user.age !== undefined)
                        available.push("Age");
                      if (user.gender) available.push("Gender");
                      if (user.date_joined) available.push("Joined");
                      return available.length ? (
                        <span className="text-sm text-gray-700">
                          {available.join(", ")}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">No info</span>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <p className="text-sm text-gray-500 font-medium">
          Showing Page {currentPage} of {totalPages || 1}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2.5 rounded-lg border bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-lg border bg-white disabled:opacity-30 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="pt-10">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1D1B20] mb-6">
          Analytics Overview
        </h1>
        <div>
          <UserGrowthChart totalUsers={totalUsers} totalBots={totalBots} />
        </div>
      </div>
    </div>
  );
}
