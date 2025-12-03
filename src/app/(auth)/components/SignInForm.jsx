"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaApple, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
import * as z from "zod";
import axios from "axios";
import Cookies from "js-cookie";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid email address"),
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
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
      const fieldErrors = {};
      error.errors.forEach((err) => {
        if (err.path && err.path.length > 0) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      return { success: false, errors: fieldErrors };
    }
    return { success: false, errors: {} };
  }
};

export default function SignInForm({ setForgotPass }) {
  const router = useRouter();

  const [showPass, setShowPass] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "alaminislam4122.bd@gmail.com",
    password: "Alamin.bd34",
    username: "alamin1",
    otp: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const requestOtp = async (credentials) => {
    try {
      setIsLoading(true);

      const url = `${API_BASE_URL}/api/login/otp/request/`;
      const response = await axios.post(url, credentials, {
        headers: { "Content-Type": "application/json" },
      });

      setFormData((prev) => ({ ...prev, otp: "" }));
      setFormErrors({});
      setIsOtpSent(true);

      toast.success(
        response.data.message ||
          "OTP sent to your email. Please check your inbox and spam folder."
      );
    } catch (error) {
      let errorMessage =
        "Server connection error. Please ensure the API is running and try again.";

      if (error.response) {
        const data = error.response.data;
        if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === "object" && Object.keys(data).length > 0) {
          errorMessage =
            Object.values(data)[0][0] ||
            `Authentication failed (Status ${error.response.status}).`;
        } else {
          errorMessage = `Request failed: Server returned status ${error.response.status}. Please check backend logs.`;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtpAndLogin = async (values) => {
    if (!values.email || !values.username || !values.otp) {
      toast.error(
        "Verification data missing. Please try requesting OTP again."
      );
      setIsOtpSent(false);
      return;
    }

    try {
      setIsLoading(true);
      const url = `${API_BASE_URL}/api/login/otp/verify/`;

      const payload = {
        email: values.email,
        username: values.username,
        otp: values.otp,
      };

      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      const { tokens } = response.data;

      if (tokens?.access) {
        Cookies.set("accessToken", tokens.access, {
          expires: 1 / 24,
        });
      }
      if (tokens?.refresh) {
        Cookies.set("refreshToken", tokens.refresh, {
          expires: 30,
        });
      }

      toast.success("Login successful!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      let errorMessage =
        "OTP verification failed. Please check your code or try requesting a new one.";

      if (error.response) {
        const data = error.response.data;
        if (data.message) {
          errorMessage = data.message;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === "object" && Object.keys(data).length > 0) {
          errorMessage =
            Object.values(data)[0][0] ||
            `Verification failed (Status ${error.response.status}).`;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoading) return;

    const validationData = { ...formData, isOtpSent };
    const validationResult = validateForm(validationData);

    if (!validationResult.success) {
      setFormErrors(validationResult.errors);
      toast.error(
        validationResult.errors[Object.keys(validationResult.errors)[0]] ||
          "Please check the form for errors."
      );
      return;
    }

    setFormErrors({});

    const { username, email, password, otp } = formData;
    const credentialsForStep1 = { username, email, password };

    if (isOtpSent) {
      verifyOtpAndLogin({ email, username, otp });
    } else {
      requestOtp(credentialsForStep1);
    }
  };

  return (
    <div>
      <div className="w-full">
        <div className="max-w-xl w-full mx-auto p-4 md:p-6 lg:p-0">
          <h1 className="text-2xl lg:text-[40px] font-bold mb-10 lg:mb-20 text-center">
            Welcome
            <span className="text-transparent bg-clip-text bg-linear-to-t from-[#FB665B] to-[#CE51A6] ">
              back
            </span>
          </h1>
          <p className="text-sm text-gray-500 my-4 text-center">
            Please check your email!
          </p>

          {!isOtpSent && (
            <>
              <div className="space-y-4">
                <button className="py-3 lg:py-5 w-full rounded-[20px] border border-secondary flex items-center justify-center gap-4 cursor-pointer text-base">
                  <Image
                    src={"/icons/gmail.png"}
                    height={24}
                    width={24}
                    alt="Gmail logo icon"
                  />{" "}
                  Continue with Email
                </button>
                <button className="py-3 lg:py-5 w-full rounded-[20px] border border-secondary flex items-center justify-center gap-2 cursor-pointer text-base">
                  {" "}
                  <span className="p-1 rounded-full bg-black flex items-center justify-center">
                    <FaApple className="text-white text-2xl" />
                  </span>{" "}
                  Continue with Apple
                </button>
              </div>

              <div className="flex flex-row items-center justify-center gap-2 py-5 lg:py-6">
                <span className="grow h-px bg-secondary"></span>{" "}
                <span className="text-secondary text-sm">or</span>
                <span className="grow h-px bg-secondary"></span>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isOtpSent && (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-base md:text-lg font-semibold">
                    Username
                  </span>
                  <input
                    type="text"
                    name="username"
                    disabled={isLoading}
                    value={formData.username}
                    onChange={handleChange}
                    className={`py-3 lg:py-4 border border-secondary rounded-2xl px-4 shadow-[0px_4px_12px_0px_#0000000D] w-full text-base`}
                    placeholder="Enter your username"
                  />
                  {formErrors.username && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.username}
                    </p>
                  )}
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-base md:text-lg font-semibold">
                    Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    disabled={isLoading}
                    value={formData.email}
                    onChange={handleChange}
                    className={`py-3 lg:py-4 border border-secondary rounded-2xl px-4 shadow-[0px_4px_12px_0px_#0000000D] w-full text-base`}
                    placeholder="example@gmail.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-base md:text-lg font-semibold">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={`py-3 lg:py-4 border border-secondary rounded-2xl px-4 shadow-[0px_4px_12px_0px_#0000000D] pr-12 w-full text-base`}
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer"
                    >
                      {showPass ? (
                        <FaRegEye className="text-secondary text-xl" />
                      ) : (
                        <FaRegEyeSlash className="text-secondary text-xl" />
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </label>
              </>
            )}

            {isOtpSent && (
              <label className="flex flex-col gap-1 pt-2">
                <span className="text-base md:text-lg font-semibold text-[#8951D5]">
                  Verification Code
                </span>
                <input
                  type="text"
                  name="otp"
                  disabled={isLoading}
                  value={formData.otp}
                  onChange={handleChange}
                  className="py-3 lg:py-4 border-2 border-[#8951D5] rounded-2xl px-4 shadow-[0px_4px_12px_0px_#0000000D] w-full text-base"
                  placeholder="Enter the 6-digit code sent to your email"
                />
                {formErrors.otp && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.otp}</p>
                )}
              </label>
            )}

            <div className="flex justify-between items-center py-2 lg:py-3 text-sm md:text-base">
              <label htmlFor="" className="flex items-center gap-1">
                <input type="checkbox" className="w-4 h-4" /> Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotPass(true)}
                className="underline decoration-primary text-transparent bg-clip-text bg-linear-to-t from-[#FB665B] to-[#8951D5] cursor-pointer font-medium"
              >
                Forgot Password
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="py-3 lg:py-5 w-full rounded-[20px] bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white font-semibold cursor-pointer text-lg transition-opacity duration-300 disabled:opacity-50"
            >
              {isLoading
                ? "Loading..."
                : isOtpSent
                ? "Verify Code & Log In"
                : "Request OTP & Log In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
