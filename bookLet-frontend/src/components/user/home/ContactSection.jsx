import React from "react";
import images from "../../../assets/assets";
import { Mail } from "lucide-react"; // Optional: icon

const ContactSection = () => {
  return (
    <div className="mt-28 mb-28 px-4">
      <div className="bg-white rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between p-6 md:p-10 max-w-6xl mx-auto border border-gray-200">
        {/* Image */}
        <div className="md:w-1/2 mb-6 md:mb-0 flex justify-center">
          <img src={images.page} alt="Open book" className="h-48 object-contain" />
        </div>

        {/* Newsletter Text and Input */}
        <div className="md:w-1/2 md:pl-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Join News Letter
          </h1>
          <p className="text-gray-600 mb-6">
            Subscribe to our newsletter and get the latest updates on new
            arrivals, special offers, and exclusive discounts.
          </p>

          <div className="flex items-center bg-gradient-to-r from-yellow-100 to-green-100 rounded-full shadow-md overflow-hidden max-w-md">
            <div className="flex items-center px-4">
              <Mail className="text-gray-600 w-5 h-5" />
            </div>
            <input
              type="email"
              placeholder="Enter email"
              className="flex-1 px-4 py-4 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
            <button className="bg-lime-300 hover:bg-lime-400 text-gray-800 font-semibold px-6 py-2 rounded-full transition-all duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
