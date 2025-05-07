import React, { useContext, useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import apiClient from "../../../api/axios";
import { toast } from "react-toastify";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";

const SignInSection = ({ onClose, setShowSignUp }) => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { getCart, checkLogged } = useContext(AppContext);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log({ username, password });
      const payload = {
        username,
        password,
      };
      const { data } = await apiClient.post("/auth/login", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(data);

      if (data.statusCode == 200) {
        toast.success(data.message || "Login successful !!!!!");
        onClose();
        await checkLogged();
        getCart();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        window.dispatchEvent(new Event("storage"));
        if (data.user.role === "Admin") {
          navigate("/admin");
        } else if (data.user.role === "Staff") {
          navigate("/staff");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data || "An unexpected error occurred during login.";
      console.log(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-xl bg-white rounded-lg p-14 relative">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-4xl font-bold text-gray-800">Sign In</h2>
          <button onClick={onClose} className="focus:outline-none">
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>
        <p className="text-gray-500 mb-6">
          Please login to continue to your account.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* username Field */}
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              className="peer w-full px-4 pt-5 pb-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300"
              placeholder=" "
              required
            />
            <label
              htmlFor="username"
              className="absolute left-4 top-2 text-sm text-blue-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              username
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

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-web-primary text-gray-800 font-semibold p-3 rounded-lg transition-colors"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* SignUp Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={() => {
                  setShowSignUp(true);
                  onClose();
                }}
              >
                Create One
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInSection;
