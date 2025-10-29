"use client";

import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Account_settings() {
  const [image, setImage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    if (!firstName || !lastName) {
      // show error
      return toast.error("All field are required")
    } else {
      // show success message
      toast.success("Profile updated successfully!");
      setFirstName("");
      setLastName("");
      setImage("");
    }
  };
  return (
    <div>
      <div>
        <div className="relative w-[110px] h-[110px] my-4">
          {/* Profile Picture */}
          <Image
            src="/images/welcome.png"
            height={110}
            width={110}
            alt="Profile picture"
            className="rounded-full border-2 border-secondary object-cover w-[110px] h-[110px]"
          />

          {/* Camera Upload Button */}
          <label className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[50px] h-[50px] cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
            <Image
              src="/icons/camera.jpg"
              height={40}
              width={40}
              alt="Camera icon"
              className="rounded-full border border-white shadow-md"
            />
          </label>
        </div>
        <br />

        {/* update user profile form */}
        <form onSubmit={handleUpdateProfile} className="space-y-6 w-full">
          <div className="flex flex-row gap-6 items-center ">
            <label className="flex flex-col gap-2 flex-1">
              <span className="text-secondary lg:text-xl font-medium">
                First Name
              </span>
              <input
                type="text"
                onChange={(v) => setFirstName(v.target.value)}
                className="py-3 lg:py-5 border border-secondary2 focus:outline-secondary2 rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                placeholder="Enter your first name"
              />
            </label>
            <label className="flex flex-col gap-2 flex-1">
              <span className="text-secondary lg:text-xl font-medium">
                Last Name
              </span>
              <input
                type="text"
                onChange={(v) => setLastName(v.target.value)}
                className="py-3 lg:py-5 border border-secondary2 focus:outline-secondary2 rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                placeholder="Enter your last name"
              />
            </label>
          </div>
          <button
            type="submit"
            className="py-3 lg:py-5 px-6 rounded-[20px] bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white font-semibold cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
