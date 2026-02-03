"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import baseApi from "@/api/base_url";
import {
  PASSWORD_RESET_REQUEST,
  PASSWORD_RESET_VERIFY,
} from "@/api/apiEntpoint";

export default function ForgotPassword({ setForgotPass }) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("request");
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isRequestDisabled = email.trim() === "" || isLoading;
  const isResetDisabled =
    code.trim() === "" ||
    password.length < 6 ||
    password !== confirmPassword ||
    isLoading;

  const handleSendResetLink = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await baseApi.post(PASSWORD_RESET_REQUEST, {
        email: trimmedEmail,
      });
      toast.success(res.data?.message || "Reset code sent to your email.");
      setStep("reset");
    } catch (error) {
      console.error("Error sending reset link:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetConfirm = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await baseApi.post(PASSWORD_RESET_VERIFY, {
        email: email.trim(),
        otp: code.trim(),
        new_password: password,
        confirm_password: confirmPassword,
      });

      toast.success(
        res.data?.message || "Password reset successful. Please sign in.",
      );
      setForgotPass?.(false);
    } catch (error) {
      console.error("Error verifying reset:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full">
        <div className="max-w-xl w-full mx-auto">
          <div className="mb-12 lg:mb-14">
            <h1 className="text-2xl lg:text-[40px] font-bold text-center">
              Forgot your password
            </h1>
            <br />
            <p className="text-center text-[20px] text-secondary max-w-3/4 mx-auto">
              No worries! Enter your email and we’ll send you a reset code
            </p>
          </div>

          {step === "request" && (
            <form onSubmit={handleSendResetLink} className="space-y-4">
              <label className="flex flex-col gap-1">
                <span className="text-2xl font-semibold">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(v) => setEmail(v.target.value)}
                  className="py-3 lg:py-5 border border-secondary rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                  placeholder="enter your email address"
                />
              </label>

              <p className="text-secondary">
                Enter the email address associated with your account.
              </p>

              <button
                type="submit"
                disabled={isRequestDisabled}
                className="py-3 lg:py-5 w-full rounded-[20px] bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white font-semibold cursor-pointer mt-6 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send reset code"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetConfirm} className="space-y-4">
              <label className="flex flex-col gap-1">
                <span className="text-lg font-medium">Verification code</span>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="py-3 lg:py-4 border border-secondary rounded-xl px-3"
                  placeholder="Enter code from email"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-lg font-medium">New password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="py-3 lg:py-4 border border-secondary rounded-xl px-3"
                  placeholder="New password"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-lg font-medium">Confirm password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="py-3 lg:py-4 border border-secondary rounded-xl px-3"
                  placeholder="Confirm password"
                />
              </label>

              <button
                type="submit"
                disabled={isResetDisabled}
                className="py-3 lg:py-5 w-full rounded-[20px] bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white font-semibold cursor-pointer mt-6 disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Reset password"}
              </button>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="text-sm text-secondary underline"
                >
                  Resend code
                </button>

                <button
                  type="button"
                  onClick={() => setForgotPass?.(false)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Back to sign in
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
