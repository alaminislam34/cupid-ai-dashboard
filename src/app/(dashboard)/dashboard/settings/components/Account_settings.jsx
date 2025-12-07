"use client";

import { PROFILE_UPDATE } from "@/api/apiEntpoint";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";

// Define the API endpoint base
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Account_settings() {
  // State for text inputs (First and Last Name)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
  });
  // State for the actual File object to be uploaded
  const [profileImageFile, setProfileImageFile] = useState(null);
  // State for the local preview URL of the image
  const [imagePreviewUrl, setImagePreviewUrl] = useState("/images/welcome.png");
  const [isLoading, setIsLoading] = useState(false);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle the form submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const { firstName, lastName } = profileData;

    if (!firstName || !lastName) {
      return toast.error("First Name and Last Name are required.");
    }

    setIsLoading(true);

    // 1. Create FormData for multipart/form-data submission
    const formData = new FormData();

    // Combine names for the 'full_name' field
    formData.append("full_name", `${firstName} ${lastName}`);

    // Append the file object if one was selected
    if (profileImageFile) {
      formData.append("profile_picture", profileImageFile);
    }

    try {
      const res = await baseApi.patch(PROFILE_UPDATE, formData, {
        headers: {
          // NOTE: Do NOT set 'Content-Type': 'application/json' when sending FormData.
          // Axios will automatically set it to 'multipart/form-data' with the correct boundary.
          authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      if (res.status === 200) {
        toast.success("Profile updated successfully! ✨");
      } else {
        // Handle unexpected success status codes (e.g., 201) if necessary
        toast.error("Profile update failed with an unexpected status.");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      // Better error messaging from an axios response
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Profile update failed. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      // Optional: Clear or reset the form state here if you want to.
      // For a settings page, typically you keep successful changes visible.
    }
  };

  return (
    <div>
      <div>
        <div className="relative w-[110px] h-[110px] my-4">
          {/* Profile Picture Display - uses imagePreviewUrl for local preview */}
          <Image
            src={imagePreviewUrl}
            height={110}
            width={110}
            alt="Profile picture"
            className="rounded-full border-2 border-secondary object-cover w-[110px] h-[110px]"
            priority // Use priority for important images like profile pictures
          />

          <label className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[50px] h-[50px] cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {/* Camera Icon - will use the actual icon/image for the button */}
            <Image
              src="/icons/camera.jpg" // Always show the camera icon here
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
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
                className="py-3 lg:py-5 border border-secondary2 focus:outline-secondary2 rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                placeholder="Enter your first name"
                disabled={isLoading}
              />
            </label>
            <label className="flex flex-col gap-2 flex-1">
              <span className="text-secondary lg:text-xl font-medium">
                Last Name
              </span>
              <input
                type="text"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
                className="py-3 lg:py-5 border border-secondary2 focus:outline-secondary2 rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
                placeholder="Enter your last name"
                disabled={isLoading}
              />
            </label>
          </div>
          <button
            type="submit"
            className="py-3 lg:py-5 px-6 rounded-[20px] bg-linear-to-r from-[#FB665B] via-[#CE51A6] to-[#8951D5] text-white font-semibold cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
