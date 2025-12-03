"use client"; // 👈 Crucial declaration to make this a Client Component

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

// Create a component to wrap providers
export default function Providers({ children }) {
  // 1. Initialize QueryClient using useState for persistence across renders
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Optional: Helps with development/testing
        staleTime: 60 * 1000, 
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* ToastContainer must also be within a Client Component */}
      <ToastContainer
        position="bottom-center"
        autoClose={1500}
        closeButton={false}
      />
    </QueryClientProvider>
  );
}