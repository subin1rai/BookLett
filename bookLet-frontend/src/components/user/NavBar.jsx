import React, { useState, useEffect, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  CircleUserRound,
  Heart,
  LogIn,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  User,
} from "lucide-react";
import images from "../../assets/assets";
import SignUp from "../user/auth/SignUpSection";
import SignIn from "../user/auth/SignInSection";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import apiClient from "../../api/axios";

const NavBar = () => {
  const navgate = useNavigate();
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const { showSignUp, setShowSignUp, showSignIn, setShowSignIn } =
    useContext(AppContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cart } = useContext(AppContext) || { cart: [] };

  const getBanner = async () => {
    try {
      const { data } = await apiClient.get("/announcement/active");
      if (!data.active) {
        setAnnouncement("");
      }
      setAnnouncement(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getBanner();
  }, []);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();

    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  // Add this useEffect to your NavBar component to disable body scrolling when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  // Also add a ref to close the menu when clicking outside
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full sticky top-0 z-50 bg-web-background">
      {/* Top promotion bar (only show if there is an announcement) */}
      {announcement?.message && (
        <div
          className={`w-full ${announcement.color} text-web-primary py-4 text-center`}
        >
          <div
            className={`container ${announcement.color} mx-auto flex items-center justify-center`}
          >
            <span className={`text-md text-white ${announcement.color}`}>
              {announcement.message}
            </span>
            <NavLink
              to="/shop"
              className={`${announcement.textColor} ${announcement.color} font-bold hover:text-yellow-200 ml-2 inline-flex items-center underline`}
            >
              Shop Now
              <ArrowRight
                className={`w-[20px] ${announcement.textColor} ml-1`}
              />
            </NavLink>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <div className="w-full py-4 pl-24">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-extrabold flex items-center text-gray-700">
              <img className="h-[40px]" src={images.logo} alt="" />
              Booklett
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center py-2 px-3 text-l font-bold transition-colors ${
                  isActive
                    ? "bg-gray-700 text-web-primary rounded-full px-5"
                    : "text-gray-700 hover:text-gray-900"
                }`
              }
            >
              Home
            </NavLink>

            <div
              className="relative"
              onMouseEnter={() => setCategoryDropdownOpen(true)}
              onMouseLeave={() => setCategoryDropdownOpen(false)}
            >
              <NavLink
                to="/books"
                className={({ isActive }) =>
                  `flex items-center py-2 px-3 text-l font-bold transition-colors ${
                    isActive
                      ? "bg-gray-700 text-web-primary rounded-full px-5"
                      : "text-gray-700 hover:text-gray-900"
                  }`
                }
              >
                Books
                <ChevronDown className="w-4 h-4 ml-1" />
              </NavLink>
              {categoryDropdownOpen && (
                <div className="absolute w-[800px] mt-1 bg-white shadow-lg z-10 py-8 px-16">
                  <div className="flex justify-between max-w-7xl mx-auto">
                    <div className="w-1/4">
                      <h3 className="text-md font-bold text-black mb-4">
                        Category
                      </h3>
                      <NavLink
                        to="/category/fiction"
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                      >
                        Fiction
                      </NavLink>
                      <NavLink
                        to="/category/non-fiction"
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                      >
                        Non-Fiction
                      </NavLink>
                      <NavLink
                        to="/category/children"
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                      >
                        Children's Books
                      </NavLink>
                      <NavLink
                        to="/category/academic"
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                      >
                        Academic
                      </NavLink>
                    </div>
                    <div className="w-1/4">
                      <h3 className="text-md font-bold text-black mb-4">
                        Top Sell
                      </h3>
                      <a
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                        href="#"
                      >
                        Top 100
                      </a>
                      <a
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                        href="#"
                      >
                        Best Authors
                      </a>
                    </div>
                    <div className="w-1/4">
                      <h3 className="text-md font-bold text-black mb-4">
                        Most Popular
                      </h3>
                      <a
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                        href="#"
                      >
                        Trending Now
                      </a>
                      <a
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                        href="#"
                      >
                        Top Rated
                      </a>
                    </div>
                    <div className="w-1/4">
                      <h3 className="text-md font-bold text-black mb-4">
                        Genres
                      </h3>
                      <a
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                        href="#"
                      >
                        Romance
                      </a>
                      <a
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                        href="#"
                      >
                        Mystery
                      </a>
                      <a
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                        href="#"
                      >
                        Sci-Fi
                      </a>
                      <a
                        className="block text-sm text-gray-700 hover:text-black mb-2"
                        href="#"
                      >
                        Fantasy
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/new-arrivals"
              className={({ isActive }) =>
                `py-2 px-3 text-l font-bold transition-colors ${
                  isActive
                    ? "bg-gray-700 text-web-primary rounded-full px-5"
                    : "text-gray-700 hover:text-gray-900"
                }`
              }
            >
              New Arrivals
            </NavLink>
            <NavLink
              to="/best-selling"
              className={({ isActive }) =>
                `py-2 px-3 text-l font-bold transition-colors ${
                  isActive
                    ? "bg-gray-700 text-web-primary rounded-full px-5"
                    : "text-gray-700 hover:text-gray-900"
                }`
              }
            >
              Best Selling Books
            </NavLink>
            <NavLink
              to="/deal-of-the-day"
              className={({ isActive }) =>
                `py-2 px-3 text-l font-bold transition-colors ${
                  isActive
                    ? "bg-gray-700 text-web-primary rounded-full px-5"
                    : "text-gray-700 hover:text-gray-900"
                }`
              }
            >
              Deal of The Day
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `py-2 px-3 text-l font-bold transition-colors ${
                  isActive
                    ? "bg-gray-700 text-web-primary rounded-full px-5"
                    : "text-gray-700 hover:text-gray-900"
                }`
              }
            >
              Contact Us
            </NavLink>
          </div>

          {/* Right side icons - GitHub style menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-full flex items-center justify-center"
              aria-expanded={menuOpen}
              aria-label="User menu"
            >
              <img src={images.user_icon} className="h-10" alt="" />
            </button>

            {menuOpen && (
              <>
                {/* Full-screen overlay to darken background */}
                <div className="fixed h-[100vh]  inset-0 bg-black bg-opacity-20 z-40" />

                {/* GitHub-style dropdown menu */}
                <div className="fixed right-0 top-0 h-screen w-80 bg-web-secondary shadow-lg z-50 overflow-auto">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="text-lg items-center font-semibold text-gray-200 flex flex-row gap-2">
                        <CircleUserRound className="text-web-primary h-8 w-8" />{" "}
                        {isLoggedIn ? "John Doe" : "Guest User"}
                      </div>
                      <div className="text-sm text-gray-100 mt-1">
                        {isLoggedIn
                          ? "john.doe@example.com"
                          : "Sign in to your account"}
                      </div>
                    </div>
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="text-gray-100 hover:text-web-primary"
                      aria-label="Close menu"
                    >
                      <svg
                        width="19"
                        height="18"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Menu sections */}
                  <div className="py-1 pb-4">
                    {/* Account section */}
                    <div className="px-4 py-2 text-sm font-semibold text-gray-100 uppercase tracking-wider">
                      Account
                    </div>
                    <div className="flex flex-col gap-4 ">
                      <NavLink
                        to="/profile"
                        className="flex flex-row gap-2  px-4 py-2 text-sm text-gray-300 hover:bg-gray-300"
                        onClick={() => setMenuOpen(false)}
                      >
                        <User />
                        Your Profile
                      </NavLink>
                      <NavLink
                        to="/orders"
                        className="flex flex-row gap-2  px-4 py-2 text-sm text-gray-300 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ShoppingCart />
                        My Orders
                      </NavLink>
                      <NavLink
                        to="/wishlist"
                        className="flex flex-row gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        <Heart />
                        My Wishlist
                      </NavLink>
                      <NavLink
                        to="/cart"
                        className="flex flex-row gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-100"
                        onClick={() => setMenuOpen(false)}
                      >
                        <ShoppingBag />
                        Cart
                      </NavLink>
                    </div>
                  </div>

                  {/* Authentication section */}
                  <div className="border-t border-gray-100 mt-1 py-1">
                    {isLoggedIn ? (
                      <button
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("role");
                          navgate("/");
                          setIsLoggedIn(false);
                          setMenuOpen(false);
                        }}
                        className="flex flex-row gap-3 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-100"
                      >
                        <LogOut />
                        Sign out
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowSignIn(true);
                          setMenuOpen(false);
                        }}
                        className="flex flex-row gap-3 w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-100"
                      >
                        <LogIn />
                        Sign in
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showSignIn && (
        <SignIn
          onClose={() => setShowSignIn(false)}
          setShowSignUp={setShowSignUp}
        />
      )}
      {showSignUp && (
        <SignUp
          onClose={() => setShowSignUp(false)}
          setShowSignIn={setShowSignIn}
        />
      )}
    </div>
  );
};

export default NavBar;
