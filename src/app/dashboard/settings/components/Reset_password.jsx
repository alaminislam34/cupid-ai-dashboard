"use client";

import {
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_VERIFY,
} from "@/api/apiEntpoint";
import baseApi from "@/api/base_url";
import React, { useState } from "react";
import { toast } from "react-toastify";

// Define the steps for clarity
const STEPS = {
  EMAIL_INPUT: 1,
  OTP_AND_PASSWORD_INPUT: 2,
};

// Define the API endpoint base (assuming this is correct)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Reset_password() {
  // 1. Manage the current step of the process
  const [step, setStep] = useState(STEPS.EMAIL_INPUT);
  const [isLoading, setIsLoading] = useState(false);

  // 2. State for all form data
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    new_password: "",
    confirm_password: "",
  });

  // Handle all input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Step 1: Request Password Reset (Send Email/OTP) ---
  const handleRequestReset = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      return toast.error("Please enter your email address.");
    }

    setIsLoading(true);

    try {
      // API endpoint to request the reset (sends OTP to email)
      const res = await baseApi.post(
        PASSWORD_RESET_REQUEST,
        { email: formData.email }
        // Note: No authorization header is typically required for a public password reset request
      );

      if (res.status === 200 || res.status === 204) {
        toast.success("OTP sent to your email. Check your inbox! 📧");
        setStep(STEPS.OTP_AND_PASSWORD_INPUT);
      } else {
        toast.error("Failed to request reset. Please try again.");
      }
    } catch (error) {
      console.error("Reset Request Error:", error);
      const errorMessage =
        error.response?.data?.email?.[0] || // Check for specific backend validation errors
        "Failed to send reset email. Please check the email address.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Step 2: Verify OTP and Set New Password ---
  const handleVerifyAndSetPassword = async (e) => {
    e.preventDefault();
    const { email, otp, new_password, confirm_password } = formData;

    if (!otp || !new_password || !confirm_password) {
      return toast.error(
        "All fields (OTP, New Password, Confirm Password) are required."
      );
    }

    if (new_password !== confirm_password) {
      return toast.error("New Password and Confirm Password must match.");
    }

    setIsLoading(true);

    try {
      // API endpoint to verify OTP and complete the password change
      const res = await baseApi.post(PASSWORD_RESET_VERIFY, {
        email,
        otp,
        new_password,
        confirm_password,
      });

      if (res.status === 200) {
        toast.success("Password reset successfully! You can now log in. 🎉");
        // Optionally, clear the form and reset step after success
        setFormData({
          email: "",
          otp: "",
          new_password: "",
          confirm_password: "",
        });
        setStep(STEPS.EMAIL_INPUT);
      } else {
        toast.error("Password change failed with an unexpected status.");
      }
    } catch (error) {
      console.error("Password Reset Verification Error:", error);
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.otp?.[0] || // Common OTP failure messages
        "Password reset failed. Check your OTP and try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Select the correct handler based on the current step
  const handleSubmit =
    step === STEPS.EMAIL_INPUT
      ? handleRequestReset
      : handleVerifyAndSetPassword;

  return (
    <div>
      <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#1D1B20]">
        Reset Password
      </h1>
      <br />
      <br />

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === STEPS.EMAIL_INPUT && (
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-2 flex-1">
              <span className="text-secondary lg:text-xl font-medium">Email Address</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="py-3 lg:py-5 border border-secondary2 focus:outline-secondary2 rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                placeholder="Enter your registered email"
                disabled={isLoading}
              />
            </label>
            <p className="text-sm text-gray-500">Enter your email to receive a password reset code.</p>
          </div>
        )}

        {/* --- STEP 2: OTP, New Password, Confirm Password Input --- */}
        {step === STEPS.OTP_AND_PASSWORD_INPUT && (
          <>
            <div className="flex flex-col gap-4">
              <label className="flex flex-col gap-2 flex-1">
                <span className="text-secondary lg:text-xl font-medium">OTP Code</span>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="py-3 lg:py-5 border border-secondary2 focus:outline-secondary2 rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  disabled={isLoading}
                />
              </label>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
              <label className="flex flex-col gap-2 flex-1">
                <span className="text-secondary lg:text-xl font-medium">New Password</span>
                <input
                  type="password"
                  name="new_password"
                  value={formData.new_password}
                  onChange={handleInputChange}
                  className="py-3 lg:py-5 border border-secondary2 focus:outline-secondary2 rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                  placeholder="********"
                  disabled={isLoading}
                />
              </label>
              <label className="flex flex-col gap-2 flex-1">
                <span className="text-secondary lg:text-xl font-medium">Confirm New Password</span>
                <input
                  type="password"
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleInputChange}
                  className="py-3 lg:py-5 border border-secondary2 focus:outline-secondary2 rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                  placeholder="********"
                  disabled={isLoading}
                />
              </label>
            </div>
          </>
        )}

        <button
          type="submit"
          className="py-3 lg:py-5 px-6 rounded-[20px] bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white font-semibold cursor-pointer disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : step === STEPS.EMAIL_INPUT
            ? "Send Reset Code"
            : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
