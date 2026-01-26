"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
// Use the configured axios instance
import baseApi from "@/api/base_url";
import { ALL_BOTS_DATA } from "@/api/apiEntpoint";

export default function Bots_profile() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchBots = async () => {
    setLoading(true);

    try {
      const response = await baseApi.get(ALL_BOTS_DATA);

      if (response.data && Array.isArray(response.data.bots)) {
        const botProfiles = response.data.bots.map((item) => item.bot);
        setBots(botProfiles);
        setError(null);
      } else {
        setBots([]);
        setError(
          "API response structure is invalid or 'bots' array is missing.",
        );
      }
    } catch (err) {
      console.error("Error fetching bot data:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to load bots. Please log in again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-xl text-gray-600">
        Loading Bots Profiles... 🤖
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-xl text-red-600">
        Error: {error}
      </div>
    );
  }

  if (bots.length === 0) {
    return (
      <div className="text-center py-10 text-xl text-gray-600">
        No bot profiles found.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[#1D1B20] font-semibold text-2xl lg:text-4xl mb-6">
          Bots Profile
        </h1>
        <button className="underline cursor-pointer">See all</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-6">
        {bots.map((bot, index) => {
          const interests = (bot.interest || "")
            .split(",")
            .map((i) => i.trim())
            .filter((i) => i !== "");

          return (
            <div
              key={bot.id || index}
              className="border p-4 h-full rounded-2xl border-secondary/10 shadow-[0px_10px_35px_0px_#00000008]"
            >
              <Image
                src={bot?.profile_picture}
                height={221}
                width={200}
                alt={`${bot.name}'s Profile picture`}
                className="mx-auto aspect-square rounded-2xl object-cover"
                priority
              />

              <h1 className="py-2 text-xl lg:text-3xl font-semibold text-center">
                {bot.name || "Bot Name"}
              </h1>

              <div className="space-y-4">
                <h4 className="font-bold">About</h4>
                <p>
                  {bot.description ||
                    `A ${bot.gender} bot who is ${bot.age} years old and enjoys ${bot.interest || "various activities"}.`}
                </p>

                <h4 className="font-bold">Interest</h4>
                <div className="flex flex-row gap-2 items-center flex-wrap">
                  {interests.length > 0 ? (
                    interests.map((interest, i) => (
                      <span
                        key={i}
                        className="rounded-4xl border border-secondary text-secondary2 px-2"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No interests listed.
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-bold">Gender:</span> {bot.gender} |{" "}
                  <span className="font-bold">Age:</span> {bot.age} |{" "}
                  <span className="font-bold">Ethnicity:</span> {bot.ethnicity}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
