"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

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
    const fetchBots = async (authToken) => {
      try {
        const response = await axios.get("/api/all-data/", {
          headers: {
            // Include the token in the Authorization header
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        });
        
        // --- 🎯 CRITICAL CORRECTION HERE ---
        // Extract the array from 'response.data.bots' and map to the inner 'bot' object
        if (response.data && Array.isArray(response.data.bots)) {
          const botProfiles = response.data.bots.map(item => item.bot);
          setBots(botProfiles);
          setError(null);
        } else {
          setBots([]);
          setError("API response structure is invalid or 'bots' array is missing.");
        }
        // ---------------------------------

      } catch (err) {
        console.error("Error fetching bot data:", err);
        setError("Failed to load bots. Please check the API endpoint and network connection.");
      } finally {
        setLoading(false);
      }
    };

    // 3. Call the fetch function if the token is available
    if (token) {
      fetchBots(token);
    }

  }, []); // Runs once on mount


  // --- Render States (Maintaining existing design) ---
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
  // --- End Render States ---


  // --- Main Render with Dynamic Data ---
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[#1D1B20] font-semibold text-2xl lg:text-4xl mb-6">
          Bots Profile
        </h1>
        <button className="underline cursor-pointer">See all</button>
      </div>
      
      {/* Dynamic Grid of Bot Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-6">
        {bots.map((bot, index) => {
          // Assuming 'interest' can be a single string or multiple comma-separated interests
          const interests = (bot.interest || "").split(',').filter(i => i.trim() !== '');

          return (
            <div 
              key={bot.id || index} // Use bot.id if available, otherwise index
              className="border p-4 rounded-2xl border-secondary shadow-[0px_10px_35px_0px_#00000008]"
            >
              {/* Image display */}
              <Image
                src={bot.profile_picture || "/images/bot.jpg"} 
                height={221}
                width={200}
                alt={`${bot.name}'s Profile picture`}
                className="mx-auto rounded-2xl object-cover" // Added object-cover for better image fitting
              />
              
              {/* Name */}
              <h1 className="py-2 text-xl lg:text-3xl font-semibold text-center">
                {bot.name || "Bot Name"}
              </h1>
              
              <div className="space-y-4">
                {/* About/Description */}
                <h4 className="font-bold">About</h4>
                <p>{bot.description || `A ${bot.gender} bot who is ${bot.age} years old and loves ${bot.interest}.`}</p>
                
                {/* Interests */}
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
                    <span className="text-sm text-gray-500">No interests listed.</span>
                  )}
                </div>
                
                {/* Added quick details like gender/age for better display */}
                <div className="text-sm text-gray-600">
                    **Gender:** {bot.gender} | **Age:** {bot.age} | **Ethnicity:** {bot.ethnicity}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}