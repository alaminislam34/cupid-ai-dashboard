"use client";

import Image from "next/image";
import ForgotPassword from "../components/ForgotPassword";
import SignInForm from "../components/SignInForm";
import { useState } from "react";

export default function SignIn() {
  const [forgotPass, setForgotPass] = useState(false);

  return (
    <div className="max-w-[1440px] w-11/12 mx-auto flex justify-center items-center min-h-screen py-12">
      <section className="lg:grid lg:grid-cols-2 gap-24 items-center w-full">
        <div className="w-full hidden lg:block">
          <div className="flex-col items-center gap-6 mx-auto flex">
            <Image
              src={"/icons/logo1.png"}
              width={400}
              height={400}
              alt="Website logo icon"
              className="w-[172px] h-[125px] object-cover bg-cover bg-center"
            />
            <Image
              src={"/images/welcome.png"}
              width={900}
              height={800}
              alt="Welcome avatar image"
              className="w-auto h-[225px] md:h-[345px] lg:h-[450px] object-cover bg-cover bg-center"
            />
          </div>
        </div>
        {forgotPass ? (
          <ForgotPassword />
        ) : (
          <SignInForm setForgotPass={setForgotPass} />
        )}
      </section>
    </div>
  );
}
