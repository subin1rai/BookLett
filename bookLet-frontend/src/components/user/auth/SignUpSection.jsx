import React, { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import apiClient from "../../../api/axios";
import { toast } from "react-toastify";

const SignUpSection = ({ onClose, setShowSignIn }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ email, username, password, confirmPassword });
    const payload = {
      email,
      username,
      password,
      confirmPassword,
    };
    const { data } = await apiClient.post("/Auth/register", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (data.statusCode == 200) {
      toast.success(data.message);
      setShowSignIn(true);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl bg-white rounded-lg p-14 relative">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-4xl font-bold text-gray-800">Sign Up</h2>
          <button onClick={onClose} className="focus:outline-none">
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <p className="text-gray-500 mb-6">Please create account to login</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-2 text-sm text-blue-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Email
            </label>
          </div>

          {/* Username Field */}
          <div className="relative">
            <input
              type="text"
              id="username"
              placeholder=" "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
              required
            />
            <label
              htmlFor="username"
              className="absolute left-4 top-2 text-sm text-blue-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Username
            </label>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
              required
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-2 text-sm text-blue-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-4 text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-purple-400" />
              ) : (
                <Eye className="w-5 h-5 text-purple-400" />
              )}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              placeholder=" "
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
              required
            />
            <label
              htmlFor="confirmPassword"
              className="absolute left-4 top-2 text-sm text-blue-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Confirm Password
            </label>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-4 text-gray-400"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-purple-400" />
              ) : (
                <Eye className="w-5 h-5 text-purple-400" />
              )}
            </button>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full bg-web-primary text-gray-800 font-semibold p-3 rounded-lg transition-colors"
          >
            Sign Up
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => {
                  setShowSignIn(true);
                  onClose();
                }}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpSection;
