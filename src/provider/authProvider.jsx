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

// Define API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// --- The Main Auth Provider Component ---
export function AuthProvider({ children }) {
  // Use null as the initial state for the user object
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Function to fetch user details using the access token
 

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Show a global loading spinner while the initial user details are being fetched. */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          {/* Simple loading indicator */}
          <p>Loading session...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

// --- Custom Hook to use the Auth Context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Standard JS error handling for context being used outside provider
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
