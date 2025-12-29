"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaApple, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { z } from "zod";
import baseApi from "@/api/base_url";
import { OTP_REQUEST, OTP_VERIFY } from "@/api/apiEntpoint";

/* ---------------- Validation Schema ---------------- */
const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  otp: z.string().optional(),
});

const validateForm = (data) => {
  try {
    const schema = data.isOtpSent
      ? signInSchema.pick({ otp: true })
      : signInSchema.omit({ otp: true });

    schema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach((e) => {
        errors[e.path[0]] = e.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: {} };
  }
};

export default function SignInForm() {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((p) => ({ ...p, [name]: undefined }));
    }
  };

  /* ---------------- Request OTP ---------------- */
  const requestOtp = async ({ email, password }) => {
    try {
      setIsLoading(true);
      const res = await baseApi.post(OTP_REQUEST, { email, password });
      setIsOtpSent(true);
      toast.success(
        res.data?.message ||
          "OTP sent to your email. Please check inbox or spam."
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Verify OTP ---------------- */
  const verifyOtpAndLogin = async ({ email, otp }) => {
    try {
      setIsLoading(true);
      const res = await baseApi.post(OTP_VERIFY, { email, otp });
      const { tokens } = res.data || {};

      if (tokens?.access) {
        Cookies.set("accessToken", tokens.access, {
          expires: rememberMe ? 7 : 1 / 24,
        });
      }

      if (tokens?.refresh) {
        Cookies.set("refreshToken", tokens.refresh, {
          expires: rememberMe ? 30 : 1,
        });
      }

      toast.success("Login successful!");
      setTimeout(() => router.push("/"), 1200);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    const validation = validateForm({ ...formData, isOtpSent });
    if (!validation.success) {
      setFormErrors(validation.errors);
      toast.error(Object.values(validation.errors)[0]);
      return;
    }

    if (isOtpSent) {
      verifyOtpAndLogin({
        email: formData.email,
        otp: formData.otp,
      });
    } else {
      requestOtp({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-0">
        <h1 className="text-3xl lg:text-[40px] font-bold mb-10 lg:mb-20 text-center">
          Welcome
          <span className="text-transparent bg-clip-text bg-linear-to-t from-[#FB665B] to-[#CE51A6] pl-2">
            back
          </span>
        </h1>

        {!isOtpSent && (
          <>
            <div className="space-y-4">
              <button className="py-3 lg:py-5 w-full rounded-[20px] border border-secondary flex items-center justify-center gap-4">
                <Image
                  src="/icons/gmail.png"
                  height={24}
                  width={24}
                  alt="Gmail"
                />
                Continue with Email
              </button>

              <button className="py-3 lg:py-5 w-full rounded-[20px] border border-secondary flex items-center justify-center gap-2">
                <span className="p-1 rounded-full bg-black">
                  <FaApple className="text-white text-2xl" />
                </span>
                Continue with Apple
              </button>
            </div>

            <div className="flex items-center gap-2 py-6">
              <span className="grow h-px bg-secondary" />
              <span className="text-secondary text-sm">or</span>
              <span className="grow h-px bg-secondary" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isOtpSent && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-3 px-4 border rounded-2xl"
              />

              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-3 px-4 border rounded-2xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPass ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
            </>
          )}

          {isOtpSent && (
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full py-3 px-4 border-2 border-[#8951D5] rounded-2xl"
            />
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="py-3 lg:py-5 w-full rounded-[20px] bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white font-semibold disabled:opacity-50"
          >
            {isLoading
              ? "Processing..."
              : isOtpSent
              ? "Verify & Login"
              : "Request OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
