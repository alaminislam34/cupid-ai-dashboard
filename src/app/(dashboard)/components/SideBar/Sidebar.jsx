"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiBarChartSquare } from "react-icons/bi";
import { GrUserSettings } from "react-icons/gr";
import { HiUsers } from "react-icons/hi2";
import { TbReportAnalytics } from "react-icons/tb";
import { IoSettings, IoClose } from "react-icons/io5"; // Close icon added
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useAuth } from "@/provider/authProvider";
import baseApi from "@/api/base_url";
import { LOGOUT } from "@/api/apiEntpoint";

export const links = [
  { name: "Dashboard Overview", icon: <BiBarChartSquare />, href: "/" },
  {
    name: "Profile Generator",
    icon: <GrUserSettings />,
    href: "/user_settings",
  },
  { name: "User management", icon: <HiUsers />, href: "/user_management" },
  {
    name: "Payment Report",
    icon: <TbReportAnalytics />,
    href: "/payment_report",
  },
  { name: "Settings", icon: <IoSettings />, href: "/settings" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const path = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [profile, setProfile] = useState("/images/bot.jpg");

  useEffect(() => {
    if (user?.profile_picture) setProfile(user.profile_picture);
  }, [user]);

  const handleLogoutRequest = async () => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) return;
    try {
      const logout = await baseApi.post(
        LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      toast.success(logout.data.message);
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      console.error("Logout API Error:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
        fixed lg:sticky top-0 lg:top-5 left-0 z-50
        w-[280px] lg:w-[300px] h-screen lg:h-[96vh] 
        bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] 
        p-6 lg:p-10 lg:rounded-2xl flex flex-col justify-between
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div>
          <div className="flex justify-between items-center lg:block">
            <Image
              src={"/icons/logo2.png"}
              height={60}
              width={90}
              alt="Logo"
              className="lg:h-[78px] lg:w-[107px]"
            />
            <button
              className="lg:hidden text-white text-3xl"
              onClick={() => setIsOpen(false)}
            >
              <IoClose />
            </button>
          </div>

          <ul className="space-y-1 mt-10">
            {links.map(({ name, icon, href }, i) => (
              <li key={i}>
                <Link
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 rounded-2xl flex items-center gap-2 duration-300 ${
                    path === href
                      ? "bg-white text-pink-600 shadow-md"
                      : "text-white hover:bg-white/10"
                  }`}
                  href={href}
                >
                  {icon} <span className="text-sm font-medium">{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-3 p-2 bg-white/10 rounded-2xl mb-4">
            <Image
              src={profile}
              height={50}
              width={50}
              alt="User"
              className="rounded-full w-12 h-12 object-cover border-2 border-white"
            />
            <h3 className="text-sm lg:text-base font-semibold text-white truncate max-w-[150px]">
              {user?.full_name || "Admin"}
            </h3>
          </div>
          <button
            onClick={handleLogoutRequest}
            className="text-base font-bold text-[#CE51A6] flex items-center justify-center gap-2 py-3 w-full bg-white rounded-xl hover:bg-gray-100 transition-all active:scale-95"
          >
            <FiLogOut /> Log out
          </button>
        </div>
      </div>
    </>
  );
}
