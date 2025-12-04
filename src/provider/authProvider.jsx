"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// --- Initial State and Context Creation ---
// Note: In JSX/JS, we often define a simple initial value,
// and rely on documentation or JSDoc for structure.
const AuthContext = createContext(undefined);

// --- The Main Auth Provider Component ---
export function AuthProvider({ children }) {
  // Use null as the initial state for the user object
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Function to fetch user details using the access token
  const fetchUser = async (token) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data);
    } catch (error) {
      console.error(
        "Token verification failed or User details fetch error:",
        error
      );
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setUser(null);
      toast.error("Session expired or invalid. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (token) {
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <p>Loading session...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
