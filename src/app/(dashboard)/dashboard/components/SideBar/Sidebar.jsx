"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiBarChartSquare } from "react-icons/bi";
import { GrUserSettings } from "react-icons/gr";
import { HiUsers } from "react-icons/hi2";
import { TbReportAnalytics } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import { useAuth } from "@/provider/authProvider";

export const links = [
  {
    name: "Dashboard Overview",
    icon: <BiBarChartSquare />,
    href: "/dashboard",
  },
  {
    name: "Profile Generator",
    icon: <GrUserSettings />,
    href: "/dashboard/user_settings",
  },
  {
    name: "User management",
    icon: <HiUsers />,
    href: "/dashboard/user_management",
  },
  {
    name: "Payment Report",
    icon: <TbReportAnalytics />,
    href: "/dashboard/payment_report",
  },
  {
    name: "Settings",
    icon: <IoSettings />,
    href: "/dashboard/settings",
  },
];

export default function Sidebar() {
  const path = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  console.log(user);
  // log out handler
  const handleLogoutRequest = async () => {
    const accessToken = Cookies.get("accessToken");
    console.log(accessToken);

    if (!accessToken) {
      console.warn("Access token not found. Proceeding with local logout.");
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const logout = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/logout/`,
        {},
        config
      );

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      toast.success(logout.data.message);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      console.error("Logout API Error:", error);
    }
  };

  return (
    <div className="w-[300px] h-[96vh] my-auto bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] p-10 rounded-2xl sticky top-5 flex flex-col justify-between">
      <div>
        <Image
          src={"/icons/logo2.png"}
          height={78}
          width={107}
          alt="Website logo icon"
        />
        <br />
        <br />
        <ul className="space-y-1 ">
          {links.map(({ name, icon, href }, i) => (
            <li key={i}>
              <Link
                className={`py-2 lg:py-3 px-4 rounded-2xl ${
                  path === href ? "bg-white text-secondary2" : " text-white"
                } hover:bg-white hover:text-secondary2 flex items-center duration-300 gap-2`}
                href={href}
              >
                {icon} {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="flex items-start gap-3">
          <Image
            src={user?.profile_picture}
            height={60}
            width={60}
            alt="User image"
            className="rounded-full w-[60px] h-[60px] bg-cover bg-center border-2 border-white"
          />
          <h3 className="lg:text-xl font-semibold text-white py-2">
            Leena Alen
          </h3>
        </div>
        <br />
        <button
          onClick={handleLogoutRequest}
          className="text-lg font-semibold text-secondary2 flex items-center justify-center gap-2 py-3 w-full bg-white rounded-2xl cursor-pointer"
        >
          <FiLogOut /> Log out
        </button>
      </div>
    </div>
  );
}
