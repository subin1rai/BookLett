import React from "react";
import { ArrowRight, UserCircle, X } from "lucide-react";
import images from "../../../assets/assets";

const PreviewBanner = ({
  banner,
  onClose,
  getColorClass,
  formatDate,
  getStatus,
}) => {
  if (!banner) return null;

  // You can adjust the logo path here. If you have a logo import, use it instead.
  const logoPath = "/logo192.png";

  return (
    <div className="w-full border rounded-lg shadow-sm overflow-hidden">
      <div
        className={`px-6 py-4 flex flex-col items-center justify-center text-center ${banner.color}`}
      >
        <div className="flex flex-row gap-1 items-center">
          <div className="text-lg text-white font-medium max-w-lg">
            {banner.message}
          </div>
          <div
            className={`flex flex-row gap-1 font-semibold text-lg ${banner.textColor}`}
          >
            Shop Now <ArrowRight />
          </div>
        </div>
      </div>
      {/* Mock Navigation Bar for Preview */}
      <div className="w-full bg-web-background py-3 border-b">
        <div className="flex flex-row justify-evenly items-center space-x-6">
          <div className="text-2xl font-extrabold flex items-center text-gray-700">
            <img className="h-[40px]" src={images.logo} alt="Booklett Logo" />
            Booklett
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <span className="text-gray-700 font-bold hover:text-black cursor-pointer">
              Home
            </span>
            <span className="text-gray-700 font-bold hover:text-black cursor-pointer">
              Books
            </span>
            <span className="text-gray-700 font-bold hover:text-black cursor-pointer">
              New Arrivals
            </span>
            <span className="text-gray-700 font-bold hover:text-black cursor-pointer">
              Best Selling
            </span>
            <span className="text-gray-700 font-bold hover:text-black cursor-pointer">
              Contact
            </span>
          </div>
          <UserCircle />
        </div>
      </div>

      <div className="px-4 py-3 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="px-2">
            <span className="font-semibold">Status:</span>{" "}
            {getStatus(banner).label}
          </div>
          <div className="px-2">
            <span className="font-semibold">Color:</span> {banner.color}
          </div>
          <div className="px-2">
            <span className="font-semibold">Date Range:</span>{" "}
            {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 flex justify-end border-t">
        <button
          onClick={onClose}
          className="flex items-center text-sm px-3 py-1 bg-white border rounded-md hover:bg-gray-50 transition-colors"
        >
          <X className="h-4 w-4 mr-1" />
          Close
        </button>
      </div>
    </div>
  );
};

export default PreviewBanner;
