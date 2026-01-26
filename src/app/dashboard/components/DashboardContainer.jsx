"use client";
import { useState } from "react";
import Sidebar from "./SideBar/Sidebar";
import { HiMenuAlt1 } from "react-icons/hi";

export default function DashboardContainer({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar - State পাস করে দেওয়া হলো */}
      <aside className="lg:p-4">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header: শুধুমাত্র মোবাইল বা ট্যাবলেটে দেখাবে */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-2xl text-gray-700 active:scale-95 transition-transform"
          >
            <HiMenuAlt1 />
          </button>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-linear-to-r from-[#FB665B] to-[#8951D5]">
            DASHBOARD
          </span>
          <div className="w-8"></div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8 overflow-x-hidden">{children}</div>
      </main>
    </div>
  );
}
