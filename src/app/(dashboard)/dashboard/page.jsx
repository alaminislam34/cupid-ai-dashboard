"use client";

import React, { useState, useMemo, useEffect } from "react";
import { HiUsers } from "react-icons/hi2";
import { RiRobot3Line } from "react-icons/ri";
import { HiOutlineInboxIn } from "react-icons/hi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import UserGrowthChart from "./components/Chart/Chart";
import axios from "axios";
import Cookies from "js-cookie";

const ITEMS_PER_PAGE = 10;

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const accessToken = Cookies.get("accessToken");

      if (!accessToken) {
        console.error("Access token not found.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/total-users/`,
          config
        );

        if (res.status === 200) {
          setTotalUsers(res.data);
          console.log("Total Users Fetched:", res.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch total users:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTotalUsers();
  }, []);

  const totalPages = Math.ceil(totalUsers.total_users / ITEMS_PER_PAGE);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return totalUsers.users?.slice(start, end);
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const overviews = [
    {
      title: "Total Users",
      value: totalUsers.total_users || 0,
      icon: <HiUsers className="text-3xl text-white" />,
    },
    {
      title: "Total Created Bots",
      value: "524",
      icon: <RiRobot3Line className="text-3xl text-white" />,
    },
    {
      title: "Total Subscribers",
      value: 0,
      icon: <HiOutlineInboxIn className="text-3xl text-white" />,
    },
  ];

  return (
    <div>
      <h1 className="text-[#1D1B20] font-semibold text-2xl lg:text-[40px] mb-6">
        Dashboard Overview
      </h1>

      <div>
        <div className="flex flex-wrap items-center gap-6 w-full">
          {overviews?.map(({ title, value, icon }, i) => (
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

        <table className="rounded-2xl border border-[#B9DAFE] w-full user-data-table shadow-lg overflow-hidden ">
          <thead>
            <tr className="bg-[#EAF7FF] text-gray-700 text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Username</th>
              {/* <th className="py-3 px-6 text-left">Email</th> */}
              <th className="py-3 px-6 text-left">Age</th>
              <th className="py-3 px-6 text-left">Gender</th>
              <th className="py-3 px-6 text-left">Subscription</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light divide-y divide-[#B9DAFE]">
            {/* Dynamically rendered rows */}
            {currentItems?.map((user, i) => (
              <tr
                key={i}
                // Apply alternating background color
                className={`${
                  i % 2 === 1 ? "bg-gray-50" : "bg-white"
                } *:border *:border-[#B9DAFE] hover:bg-gray-100`}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {user.full_name}
                </td>
                <td className="py-3 px-6 text-left">{user.username}</td>
                {/* <td className="py-3 px-6 text-left">{user.email}</td> */}
                <td className="py-3 px-6 text-left">{user.age}</td>
                <td className="py-3 px-6 text-left">{user.gender}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-medium 
                    ${
                      user.subscription === "Premium"
                        ? "bg-blue-200 text-blue-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {user.subscription}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          id="pagination-controls"
          className="flex justify-end mt-6 space-x-2"
        >
          <div className="flex items-center justify-center">
            <p className="text-secondary">
              {currentPage} - {pageNumbers.length} of 10
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

        <div>
          <h1 className="text-[#1D1B20] font-semibold text-2xl lg:text-4xl mb-6">
            Analytics Overview
          </h1>
          <UserGrowthChart totalUsers={totalUsers} />
        </div>
      </div>
    </div>
  );
}
