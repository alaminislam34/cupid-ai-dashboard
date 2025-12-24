"use client";
import React, { useState } from "react";
import Account_settings from "./components/Account_settings";
import Reset_password from "./components/Reset_password";
import Privacy_policy from "./components/Privacy_policy";
import Terms_condition from "./components/Terms_condition";
import Support_center from "./components/Support_center";

export const settings = [
  "Account Settings",
  "Reset Password",
  "Privacy Settings",
  "Terms & Conditions",
  "Support Center",
];
export default function Settings() {
  const [activeSetting, setActiveSetting] = useState("Account Settings");
  return (
    <div>
      <h1 className="text-[#1D1B20] font-semibold text-2xl lg:text-[40px] mb-6">
        Settings
      </h1>
      {/* Settings option */}
      <div className="flex flex-wrap items-center gap-4 py-6">
        {settings.map((item, i) => (
          <button
            onClick={() => setActiveSetting(item)}
            key={i}
            className={`py-2 lg:py-3 px-6 border-b-2 cursor-pointer lg:text-xl ${
              activeSetting === item
                ? "border-b-secondary2 text-secondary2 font-bold"
                : "text-secondary border-b-secondary"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {activeSetting === "Account Settings" ? (
        <Account_settings />
      ) : activeSetting === "Reset Password" ? (
        <Reset_password />
      ) : activeSetting === "Privacy Settings" ? (
        <Privacy_policy />
      ) : activeSetting === "Terms & Conditions" ? (
        <Terms_condition />
      ) : activeSetting === "Support Center" ? (
        <Support_center />
      ) : (
        <Account_settings />
      )}
    </div>
  );
}
