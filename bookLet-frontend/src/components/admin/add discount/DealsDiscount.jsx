import React, { useState } from "react";
import apiClient from "../../../api/axios";

const DealsDiscount = ({ bookId, onClose }) => {
  const [formData, setFormData] = useState({
    discountPercentage: "",
    startDate: "",
    endDate: "",
    isOnSale: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        Discount: formData.discountPercentage,
        StartTime: formData.startDate,
        EndTime: formData.endDate,
        IsOnSale: formData.isOnSale,
      };
      const res = await apiClient.put(
        `/bookcrud/discountOffer/${bookId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onClose();
    } catch (error) {
      console.log("Failed to add timed discount");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
      <h2 className="text-xl font-medium text-gray-700 mb-6">Add Discount</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">
            Discount Percentage
          </label>
          <input
            type="text"
            value={formData.discountPercentage}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, discountPercentage: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <div className="flex items-center">
            <input
              type="text"
              value={formData.startDate}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <button type="button" className="ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <div className="flex items-center">
            <input
              type="text"
              value={formData.endDate}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
            <button type="button" className="ml-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isOnSale}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              onChange={(e) =>
                setFormData({ ...formData, isOnSale: e.target.checked })
              }
            />
            <span className="ml-2 text-sm text-gray-700">Set as On Sale</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-800 focus:outline-none"
          >
            Add Discount
          </button>
        </div>
      </form>
    </div>
  );
};

export default DealsDiscount;
