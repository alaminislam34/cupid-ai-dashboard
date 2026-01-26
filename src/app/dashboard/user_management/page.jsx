"use client";

import React, { useState, useMemo } from "react";
import { HiUsers } from "react-icons/hi2";
import { RiRobot3Line } from "react-icons/ri";
import { HiOutlineInboxIn } from "react-icons/hi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { TiEdit } from "react-icons/ti";
import { RiDeleteBinLine } from "react-icons/ri";
import { useAuth } from "@/provider/authProvider";

// --- 3. REACT COMPONENT WITH PAGINATION LOGIC ---
export default function UserManagemenrt() {
  const [currentPage, setCurrentPage] = useState(1);
  const { totalUsers } = useAuth();
  console.log(totalUsers);
  // --- 1. OVERVIEW DATA (Unchanged) ---

  const today = new Date();

  // Normalize users array - `totalUsers` may be an object with `users` or an array
  const usersArray = Array.isArray(totalUsers)
    ? totalUsers
    : totalUsers?.users || [];

  const newUsers = usersArray?.length
    ? usersArray.filter((user) => {
        const joinedDate = new Date(user.date_joined);
        return (
          joinedDate.getDate() === today.getDate() &&
          joinedDate.getMonth() === today.getMonth() &&
          joinedDate.getFullYear() === today.getFullYear()
        );
      }).length
    : 0;
  const overviews = [
    {
      title: "Total Users",
      value: totalUsers?.total_users || 0,
      icon: <HiUsers className="text-3xl text-white" />,
    },
    {
      title: "New Users",
      value: newUsers || 0,
      icon: <HiUsers className="text-3xl text-white" />,
    },
  ];

  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil((usersArray.length || 0) / ITEMS_PER_PAGE) || 1;

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return usersArray.slice(start, end);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate an array of page numbers
  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages],
  );

  return (
    <div>
      <h1 className="text-[#1D1B20] font-semibold text-2xl lg:text-[40px] mb-6">
        Dashboard Overview
      </h1>

      <div>
        <div className="flex flex-wrap items-center gap-6 w-full">
          {overviews.map(({ title, value, icon }, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-secondary flex-1 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-[20px] font-medium">{title}</h4>
                <span className="p-2 bg-[#979797] rounded-full flex items-center justify-center">
                  {icon}
                </span>
              </div>
              <h1 className="text-[32px] font-medium">{value}</h1>
            </div>
          ))}
        </div>

        <br />

        {/* User Table (using Tailwind classes as provided) */}
        <table className="rounded-2xl border border-[#B9DAFE] w-full user-data-table shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-[#EAF7FF] text-gray-700 text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Username</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Age</th>
              <th className="py-3 px-6 text-left">Gender</th>
              <th className="py-3 px-6 text-left">End</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light divide-y divide-[#B9DAFE]">
            {/* Dynamically rendered rows */}
            {currentItems?.map((user, i) => {
              const displayName = user.full_name || user.name || "-";
              const displayUsername =
                user.username || (user.email ? user.email.split("@")[0] : "-");
              const displayAge = user.age ?? "-";
              const displayGender = user.gender || "-";

              return (
                <tr
                  key={user.id ?? i}
                  // Apply alternating background color
                  className={`${i % 2 === 1 ? "bg-gray-50" : "bg-white"} *:border *:border-[#B9DAFE] hover:bg-gray-100`}
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {displayName}
                  </td>
                  <td className="py-3 px-6 text-left">{displayUsername}</td>
                  <td className="py-3 px-6 text-left">{user?.email || "-"}</td>
                  <td className="py-3 px-6 text-left">{displayAge}</td>
                  <td className="py-3 px-6 text-left">{displayGender}</td>
                  <td className="py-3 px-6 text-left">
                    {user.end?.can_delete ? (
                      <button className="cursor-pointer">
                        <RiDeleteBinLine className="text-2xl text-red-600 inline" />
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div
          id="pagination-controls"
          className="flex justify-end mt-6 space-x-2"
        >
          <div className="flex items-center justify-center">
            <p className="text-secondary">
              {currentPage} - {pageNumbers.length} of {usersArray.length}
            </p>
          </div>

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 ${
              currentPage === 1
                ? "opacity-30 cursor-not-allowed"
                : "text-gray-700 cursor-pointer"
            }`}
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 ${
              currentPage === totalPages
                ? "opacity-30 cursor-not-allowed"
                : "text-gray-700 cursor-pointer"
            }`}
          >
            <FaChevronRight />
          </button>
        </div>

        <br />
        <br />
      </div>
    </div>
  );
}
