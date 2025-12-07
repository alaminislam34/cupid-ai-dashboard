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
  // --- 1. OVERVIEW DATA (Unchanged) ---

  const today = new Date();

  const newUsers = totalUsers?.users?.filter((user) => {
    const joinedDate = new Date(user.date_joined);
    return (
      joinedDate.getDate() === today.getDate() &&
      joinedDate.getMonth() === today.getMonth() &&
      joinedDate.getFullYear() === today.getFullYear()
    );
  }).length;
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

  // --- 2. DUMMY USER DATA FOR PAGINATION ---
  const ALL_USERS = Array.from({ length: 25 }, (_, i) => ({
    name: `User ${i + 1}`,
    username: `user_${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 10),
    gender: i % 2 === 0 ? "Male" : "Female",
    subscription: i % 3 === 0 ? "Basic" : "Premium",
  }));

  const ITEMS_PER_PAGE = 10; // Set the number of rows per page

  // Calculate total pages
  const totalPages = Math.ceil(ALL_USERS.length / ITEMS_PER_PAGE);

  // Determine the data slice for the current page
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return ALL_USERS.slice(start, end);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate an array of page numbers
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

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
        <table className="rounded-2xl border border-[#B9DAFE] w-full user-data-table shadow-lg overflow-hidden ">
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
            {currentItems.map((user, i) => (
              <tr
                key={i}
                // Apply alternating background color
                className={`${
                  i % 2 === 1 ? "bg-gray-50" : "bg-white"
                } *:border *:border-[#B9DAFE] hover:bg-gray-100`}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {user.name}
                </td>
                <td className="py-3 px-6 text-left">{user.username}</td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{user.age}</td>
                <td className="py-3 px-6 text-left">{user.gender}</td>
                <td className="py-3 px-6 text-left">
                  <button className="cursor-pointer">
                    <RiDeleteBinLine className="text-2xl text-red-600 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div
          id="pagination-controls"
          className="flex justify-end mt-6 space-x-2"
        >
          <div className="flex items-center justify-center">
            <p className="text-secondary">
              {currentPage} - {pageNumbers.length} of 10
            </p>
          </div>

          {/* Previous Button */}
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

          {/* Next Button */}
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
