"use client";

import Image from "next/image";
import ForgotPassword from "./components/ForgotPassword";
import SignInForm from "./components/SignInForm";
import { useState } from "react";

export default function SignIn() {
  const [forgotPass, setForgotPass] = useState(false);

  return (
    <div className="max-w-[1440px] w-11/12 mx-auto flex items-center justify-center min-h-screen py-12">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        {/* image section */}
        <div className="w-full">
          <div className="flex flex-col items-center gap-6 mx-auto">
            <Image
              src={"/icons/logo1.png"}
              width={400}
              height={400}
              alt="Website logo icon"
              className="w-[172px] h-[125px]"
            />
            <Image
              src={"/images/welcome.png"}
              width={600}
              height={400}
              alt="Welcome avatar image"
              className="w-[543px] h-[375px]"
            />
          </div>
        </div>
        {/* form section */}
        {forgotPass ? (
          <ForgotPassword />
        ) : (
          <SignInForm setForgotPass={setForgotPass} />
        )}
      </section>
    </div>
  );
}
