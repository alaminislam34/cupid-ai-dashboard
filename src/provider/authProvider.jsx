"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

import baseApi from "@/api/base_url";
import {
  ADMIN_TOTAL_BOTS,
  ADMIN_TOTAL_USERS,
  PROFILE_DETAILS,
} from "@/api/apiEntpoint";

const initialContextState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  totalUsers: 0,
  totalBots: 0,
  refreshAdminMetrics: () => {},
};

// Create the Auth Context
const AuthContext = createContext(initialContextState);
const fetchMetrics = async (endpoint) => {
  const accessToken = Cookies.get("accessToken");

  if (!accessToken) {
    return 0;
  }

  try {
    const res = await baseApi.get(endpoint);

    return res.data || 0;
  } catch (error) {
    console.error(
      `Failed to fetch ${endpoint}:`,
      error.response?.data || error.message
    );
    return 0;
  }
};

// --- The Main Auth Provider Component ---
export function AuthProvider({ children }) {
  // --- Core Auth State ---
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Admin Metrics State ---
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBots, setTotalBots] = useState(0);
  const [metricsRefreshKey, setMetricsRefreshKey] = useState(0);

  const isAuthenticated = !!user;

  // Function to fetch user details using the access token (Memoized with useCallback)
  const fetchUser = useCallback(async (token) => {
    setIsLoading(true);
    try {
      // 💡 CHANGE 2: Use baseApi.get() with the relative endpoint /api/profile/
      // The Authorization header is now automatically added by baseApi's request interceptor.
      const response = await baseApi.get(PROFILE_DETAILS);

      setUser(response.data);
    } catch (error) {
      console.error(
        "Token verification failed or User details fetch error:",
        error
      );
      // Clean up manually if the interceptor failed to handle the refresh
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setUser(null);
      toast.error("Session expired or invalid. Please log in again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Primary Effect for User Authentication Check on Mount
  useEffect(() => {
    const token = Cookies.get("accessToken");

    if (token) {
      // We still need the token check here to trigger fetchUser initially.
      fetchUser(token);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const refreshAdminMetrics = useCallback(() => {
    setMetricsRefreshKey((prev) => prev + 1);
  }, []);

  // 2. Secondary Effect for Admin Metrics Fetching (Only runs when required)
  useEffect(() => {
    const loadMetrics = async () => {
      if (!isAuthenticated) return;

      // 💡 CHANGE 3: The fetchMetrics helper now uses baseApi internally.
      const users = await fetchMetrics(ADMIN_TOTAL_USERS);
      const bots = await fetchMetrics(ADMIN_TOTAL_BOTS);

      setTotalUsers(users);
      setTotalBots(bots);
    };

    loadMetrics();
  }, [isAuthenticated, metricsRefreshKey]);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      totalBots,
      totalUsers,
      refreshAdminMetrics,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      totalBots,
      totalUsers,
      refreshAdminMetrics,
    ]
  );

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

// Custom hook to use the Auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
