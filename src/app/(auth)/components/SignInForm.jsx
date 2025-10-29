"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaApple, FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { toast } from "react-toastify";
export default function SignInForm({ setForgotPass }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const navigate = useRouter();

  //   todo: handle sign in
  const handleSignIn = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    } else {
      toast.success("Signed in successfully!");
      localStorage.setItem("user", JSON.stringify({ email, login: true }));

      // navigate to dashboard
      navigate.push("/dashboard");
    }
  };

  return (
    <div>
      {/* sign in form */}
      <div className="w-full">
        <div className="max-w-xl w-full mx-auto">
          {/* todo: use lora font */}
          <h1 className="text-2xl lg:text-[40px] font-bold mb-12 lg:mb-20 text-center">
            Welcome{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-t from-[#FB665B] to-[#CE51A6] ">
              back
            </span>
          </h1>

          {/* social login button */}
          <div className="space-y-4">
            <button className="py-3 lg:py-5 w-full rounded-[20px] border border-secondary flex items-center justify-center gap-4 cursor-pointer">
              <Image
                src={"/icons/gmail.png"}
                height={24}
                width={24}
                alt="Gmail logo icon"
              />{" "}
              Continue with Email
            </button>
            <button className="py-3 lg:py-5 w-full rounded-[20px] border border-secondary flex items-center justify-center gap-2 cursor-pointer">
              {" "}
              <span className="p-1 rounded-full bg-black flex items-center justify-center">
                <FaApple className="text-white text-2xl" />
              </span>{" "}
              Continue with Apple
            </button>
          </div>

          {/* divider */}
          <div className="flex flex-row items-center justify-center gap-2 py-5 lg:py-6">
            <span className="w-[60px] h-[1] bg-secondary"></span>
            <span className="text-secondary">or</span>
            <span className="w-[60px] h-[1] bg-secondary"></span>
          </div>

          {/* form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* email */}
            <label className="flex flex-col gap-1">
              <span className="text-2xl font-semibold">Email</span>
              <input
                type="email"
                onChange={(v) => setEmail(v.target.value)}
                className="py-3 lg:py-5 border border-secondary rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                placeholder="example@gmail.com"
              />
            </label>

            {/* password */}
            <label className="flex flex-col gap-1">
              <span className="text-2xl font-semibold">Password</span>
              <div className="relative">
                <input
                  type="password"
                  onChange={(v) => setPassword(v.target.value)}
                  className="py-3 lg:py-5 border border-secondary rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D] pr-12 w-full"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute top-1/2 -translate-y-1/2 right-8 cursor-pointer"
                >
                  {showPass ? (
                    <FaRegEye className="text-secondary" />
                  ) : (
                    <FaRegEyeSlash className="text-secondary" />
                  )}
                </button>
              </div>
            </label>

            <div className="flex justify-between items-center py-2 lg:py-3">
              <label htmlFor="">
                <input type="checkbox" /> Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotPass(true)}
                className="underline decoration-[#8951D5] text-transparent bg-clip-text bg-linear-to-t from-[#FB665B] to-[#8951D5] cursor-pointer"
              >
                Forgot Password
              </button>
            </div>

            <button
              type="submit"
              className="py-3 lg:py-5 w-full rounded-[20px] bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white font-semibold cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
