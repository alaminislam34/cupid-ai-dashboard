"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import baseApi from "@/api/base_url";
import { ALL_BOTS_DATA } from "@/api/apiEntpoint";

export default function Bots_profile() {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // 1. Get the accessToken from cookies
    const token = Cookies.get("accessToken");
    if (token) {
      setAccessToken(token);
    } else {
      setError("Authorization failed: Access Token is missing.");
      setLoading(false);
      return;
    }

    // 2. Define the function to fetch bot data
    const fetchBots = async (accessToken) => {
      try {
        const response = await baseApi.get(ALL_BOTS_DATA, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data && Array.isArray(response.data.bots)) {
          const botProfiles = response.data.bots.map((item) => item.bot);
          setBots(botProfiles);
          setError(null);
        } else {
          setBots([]);
          setError(
            "API response structure is invalid or 'bots' array is missing."
          );
        }
      } catch (err) {
        console.error("Error fetching bot data:", err);
        setError(
          "Failed to load bots. Please check the API endpoint and network connection."
        );
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchBots(accessToken);
    }
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-xl text-gray-600">
        Loading Bots Profiles...
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
            .filter((i) => i.trim() !== "");

          return (
            <div
              key={bot.id || index}
              className="border p-4 rounded-2xl border-secondary shadow-[0px_10px_35px_0px_#00000008]"
            >
              <Image
                src={bot.profile_picture || "/images/bot.jpg"}
                height={221}
                width={200}
                alt={`${bot.name}'s Profile picture`}
                className="mx-auto rounded-2xl object-cover"
              />

              <h1 className="py-2 text-xl lg:text-3xl font-semibold text-center">
                {bot.name || "Bot Name"}
              </h1>

              <div className="space-y-4">
                <h4 className="font-bold">About</h4>
                <p>
                  {bot.description ||
                    `A ${bot.gender} bot who is ${bot.age} years old and loves ${bot.interest}.`}
                </p>

                <h4 className="font-bold">Interest</h4>
                <div className="flex flex-row gap-2 items-center flex-wrap">
                  {interests.length > 0 ? (
                    interests.map((interest, i) => (
                      <span
                        key={i}
                        className="rounded-4xl border border-secondary text-secondary2 px-2"
                      >
                        {interest.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      No interests listed.
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  **Gender:** {bot.gender} | **Age:** {bot.age} | **Ethnicity:**{" "}
                  {bot.ethnicity}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
