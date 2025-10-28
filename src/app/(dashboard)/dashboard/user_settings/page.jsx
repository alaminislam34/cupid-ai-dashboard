"use client";

import { useState } from "react";
import Bots_profile from "./components/Bots_profile";

export default function user_settings() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [about, setAbout] = useState("");
  const [interest, setInterest] = useState("");

  return (
    <div className="w-full">
      <h1 className="text-[#1D1B20] font-semibold text-2xl lg:text-[40px] mb-6">
        Profile Generator
      </h1>
      {/* profile generator form */}
      <form className="w-11/12 mx-auto space-y-4">
        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">Name</span>
          <input
            type="text"
            onChange={(v) => setName(v.target.value)}
            className="py-2 focus:border-none focus:outline-none"
          />
        </label>
        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">Age</span>
          <input
            type="number"
            onChange={(v) => setAge(v.target.value)}
            className="py-2 focus:border-none focus:outline-none"
          />
        </label>
        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">Height</span>
          <input
            type="number"
            onChange={(v) => setHeight(v.target.value)}
            className="py-2 focus:border-none focus:outline-none"
          />
        </label>
        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">About</span>
          <textarea
            type="text"
            rows={5}
            placeholder="Write here...."
            onChange={(v) => setAbout(v.target.value)}
            className="py-2 focus:border-none focus:outline-none"
          />
        </label>
        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">Interest</span>
          <input
            type="text"
            onChange={(v) => setInterest(v.target.value)}
            className="py-2 focus:border-none focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="py-3 lg:py-5 w-full rounded-[20px] text-lg font-medium bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white cursor-pointer"
        >
          + Design
        </button>
      </form>
      <br /> <br />
      {/* profiles card */}
      <Bots_profile />
    </div>
  );
}
