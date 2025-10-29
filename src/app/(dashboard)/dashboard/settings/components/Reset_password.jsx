import React, { useState } from "react";
import { toast } from "react-toastify";

export default function Reset_password() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      return toast.error("All field are required");
    } else {
      // reset password
      toast.success("Password reset successfully");
      setNewPassword("");
      setOldPassword("");
    }
  };
  return (
    <div>
      <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-[#1D1B20]">
        Reset Password
      </h1>
      <br />
      <br />
      {/* update user profile form */}
      <form onSubmit={handleResetPassword} className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
          <label className="flex flex-col gap-2 flex-1">
            <span className="text-secondary lg:text-xl font-medium">
              Old Password
            </span>
            <input
              type="password"
              value={oldPassword}
              onChange={(v) => setOldPassword(v.target.value)}
              className="py-3 lg:py-5 border border-secondary2 focus:outline-secondary2 rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
              placeholder="********"
            />
          </label>
          <label className="flex flex-col gap-2 flex-1">
            <span className="text-secondary lg:text-xl font-medium">
              New Password
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(v) => setNewPassword(v.target.value)}
              className="py-3 lg:py-5 border border-secondary2 focus:outline-secondary2 rounded-[20px] px-4 shadow-[0px_4px_12px_0px_#0000000D]"
              placeholder="********"
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
  );
}
