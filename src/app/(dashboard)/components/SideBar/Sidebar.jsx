"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BiBarChartSquare } from "react-icons/bi";
import { GrUserSettings } from "react-icons/gr";
import { HiUsers } from "react-icons/hi2";
import { TbReportAnalytics } from "react-icons/tb";
import { IoSettings, IoClose } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useAuth } from "@/provider/authProvider";
import baseApi from "@/api/base_url";
import { LOGOUT } from "@/api/apiEntpoint";

/* Sidebar links */
export const links = [
  { name: "Dashboard Overview", icon: BiBarChartSquare, href: "/" },
  { name: "Profile Generator", icon: GrUserSettings, href: "/user_settings" },
  { name: "User management", icon: HiUsers, href: "/user_management" },
  { name: "Payment Report", icon: TbReportAnalytics, href: "/payment_report" },
  { name: "Settings", icon: IoSettings, href: "/settings" },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const path = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState("/images/bot.jpg");

  /* Hydration safe */
  useEffect(() => {
    setMounted(true);
    if (user?.profile_picture) setProfile(user.profile_picture);
  }, [user]);

  if (!mounted) return null;

  const handleLogoutRequest = async () => {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) return;

    try {
      const res = await baseApi.post(
        LOGOUT,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Safer cookie removal
      Cookies.remove("accessToken", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });

      toast.success(res.data.message || "Logged out successfully!");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      console.error("Logout API Error:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed lg:sticky top-0 lg:top-5 left-0 z-50
          w-70 lg:w-75 h-screen lg:h-[96vh]
          bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5]
          p-6 lg:p-10 lg:rounded-2xl flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo & Close button */}
        <div>
          <div className="flex justify-between items-center lg:block">
            <Image
              src="/icons/logo2.png"
              height={60}
              width={90}
              alt="Logo"
              className="lg:h-20 lg:w-26.75"
              priority
            />
            <button
              className="lg:hidden text-white text-3xl"
              onClick={() => setIsOpen(false)}
            >
              <IoClose />
            </button>
          </div>

          {/* Links */}
          <ul className="space-y-1 mt-10">
            {links.map(({ name, icon: Icon, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`py-3 px-4 rounded-2xl flex items-center gap-2 duration-300 ${
                    path === href
                      ? "bg-white text-pink-600 shadow-md"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <Icon />
                  <span className="text-sm font-medium">{name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* User info & Logout */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 p-2 bg-white/10 rounded-2xl mb-4">
            <Image
              src={profile}
              height={48}
              width={48}
              alt="User"
              className="rounded-full object-cover border-2 border-white"
            />
            <h3 className="text-sm lg:text-base font-semibold text-white truncate max-w-37.5">
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
