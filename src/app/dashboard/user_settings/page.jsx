"use client";

import { useEffect, useState } from "react";
import Bots_profile from "./components/Bots_profile";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import baseApi from "@/api/base_url";
import { CREATE_BOT } from "@/api/apiEntpoint";

export default function UserSettings() {
  // Existing state variables
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [description, setDescription] = useState("");
  const [interest, setInterest] = useState("");

  const [gender, setGender] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No client-only token handling here; `baseApi` handles attaching
    // the Authorization header using cookies and refresh logic.
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const profileData = {
      name,
      gender,
      age,
      height,
      ethnicity,
      interest,
      description,
    };

    console.log("Data to be sent:", profileData);
    try {
      const payload = {
        ...profileData,
        age: Number(profileData.age) || 0,
        height: Number(profileData.height) || 0,
      };

      const response = await baseApi.post(CREATE_BOT, payload);

      console.log("Profile Design Success:", response.data);
      toast.success("Profile designed successfully!");
    } catch (err) {
      console.error("Profile Design Error:", err);
      setError("Failed to design profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-[#1D1B20] font-semibold text-2xl lg:text-[40px] mb-6">
        Profile Generator
      </h1>
      <form className="w-11/12 mx-auto space-y-4" onSubmit={handleSubmit}>
        {/* Existing Fields */}
        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">Name</span>
          <input
            type="text"
            onChange={(v) => setName(v.target.value)}
            className="py-2 focus:border-none focus:outline-none"
          />
        </label>

        {/* New Field: Gender (Using a select for better UX/validation) */}
        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">Gender</span>
          <select
            onChange={(v) => setGender(v.target.value)}
            className="py-2 focus:border-none focus:outline-none bg-white"
            value={gender}
          >
            <option value="" className="text-gray-300">
              Select gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">Age</span>
          <input
            type="number"
            onChange={(v) => setAge(Number(v.target.value))} // Ensure age is stored as a number
            className="py-2 focus:border-none focus:outline-none"
          />
        </label>

        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">Height (e.g., 5.6)</span>
          <input
            type="number"
            step="0.1" // Allow decimal for height
            onChange={(v) => setHeight(Number(v.target.value))} // Store as number
            className="py-2 focus:border-none focus:outline-none"
          />
        </label>

        {/* New Field: Ethnicity */}
        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">Ethnicity</span>
          <input
            type="text"
            onChange={(v) => setEthnicity(v.target.value)}
            className="py-2 focus:border-none focus:outline-none"
          />
        </label>

        <label className="p-2 px-4 border rounded-2xl w-full flex flex-col gap-1 border-secondary2">
          <span className="text-secondary2">About</span>
          <textarea
            rows={5}
            placeholder="Write here...."
            onChange={(v) => setDescription(v.target.value)}
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

        {/* Submission Button */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="py-3 lg:py-5 w-full rounded-[20px] text-lg font-medium bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white cursor-pointer disabled:opacity-50"
        >
          {loading ? "Designing..." : "+ Design"}
        </button>
      </form>
      <br /> <br />
      {/* profiles card */}
      <Bots_profile />
    </div>
  );
}
