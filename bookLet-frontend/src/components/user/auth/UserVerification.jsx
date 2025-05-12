import React, { useState } from "react";
import { X } from "lucide-react";
import apiClient from "../../../api/axios";
import { toast } from "react-toastify";

const UserVerification = ({ onClose, setShowSignIn, userId }) => {
  const [otp, setOTP] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        VerificationCode: otp,
        Id: userId,
      };
      console.log(payload)
      const { data } = await apiClient.put("/auth/verify", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (data.statusCode === 200) {
        toast.success(data.message);
        setShowSignIn(true);
        onClose();
      }
    } catch (error) {
      console.log("Verification error:", error);
      toast.error("Verification failed. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl bg-white rounded-lg p-14 relative">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-4xl font-bold text-gray-800">Verify Email</h2>
          <button onClick={onClose} className="focus:outline-none">
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <p className="text-gray-500 mb-6">Please verify your email.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
              placeholder=" "
              required
            />
            <label
              className="absolute left-4 top-2 text-sm text-blue-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              OTP
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-web-primary text-gray-800 font-semibold p-3 rounded-lg transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserVerification;