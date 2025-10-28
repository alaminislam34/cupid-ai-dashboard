"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const isDisabled = email.trim() === "";
  const [emailError, setEmailError] = useState(false);

  const handleSendResetLink = (e) => {
    e.preventDefault();

    if(!email) setEmailError(true);
    else setEmailError(false);

   if(email) {
    toast.success("Reset link sent to your email!");
   }
  }

  return (
    <div>
      {/* sign in form */}
      <div className="w-full">
        <div className="max-w-xl w-full mx-auto">
          {/* todo: use lora font */}
          <div className="mb-12 lg:mb-14">
            <h1 className="text-2xl lg:text-[40px] font-bold text-center">
              Forgot your password
            </h1>
            <br />
            <p className="text-center text-[20px] text-secondary max-w-3/4 mx-auto">
              No worries! Enter your email and we’ll send you a reset code
            </p>
          </div>
          {/* form */}
          <form onSubmit={handleSendResetLink} className="space-y-4">
            {/* email */}
            <label className="flex flex-col gap-1">
              <span className="text-2xl font-semibold">Email</span>
              <input
                type="email"
                onChange={(v) => setEmail(v.target.value)}
                className="py-3 lg:py-5 border border-secondary rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                placeholder="enter your email address"
              />
            </label>
            <p className="text-secondary">
              Enter the email address associated with your Boomerang.study
              account.
            </p>

            <button type="submit" disabled={isDisabled} className="py-3 lg:py-5 w-full rounded-[20px] bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white font-semibold cursor-pointer mt-6">
              Send reset link
            </button>
          </form>
          <br /> <br />
          <p className="text-center text-secondary">
            Don’t have an account?{" "}
            <span className="bg-clip-text text-transparent bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] font-semibold cursor-pointer">
              Sign up for free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
