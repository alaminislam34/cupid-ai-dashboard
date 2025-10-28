"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiBarChartSquare } from "react-icons/bi";
import { GrUserSettings } from "react-icons/gr";
import { HiUsers } from "react-icons/hi2";
import { TbReportAnalytics } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { usePathname } from "next/navigation";

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
  return (
    <div className="w-[300px] h-[96vh] my-auto bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] p-10 rounded-2xl">
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
  );
}
