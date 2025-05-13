import React, { useState } from "react";
import { Calendar, X, Percent } from "lucide-react";
import { toast } from "react-toastify";
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
        StartTime: new Date(formData.startDate).toISOString(),
        EndTime: new Date(formData.endDate).toISOString(),
        IsOnSale: formData.isOnSale,
      };
      console.log(payload);
      const { data } = await apiClient.put(
        `/bookcrud/discountOffer/${bookId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.status == "success") {
        toast.success(data.message);
        onClose();
      }
    } catch (error) {
      console.log("Failed to add timed discount");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl p-6 relative overflow-hidden">
        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="pt-6 px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-1">
            Add Special Offer
          </h2>
          <p className="text-gray-500 mb-6">
            Create a limited-time discount for this book
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount Percentage
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Percent size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.discountPercentage}
                  placeholder="Enter discount percentage"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discountPercentage: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={formData.startDate}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={formData.endDate}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="py-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isOnSale}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  onChange={(e) =>
                    setFormData({ ...formData, isOnSale: e.target.checked })
                  }
                />
                <span className="ml-3 text-sm text-gray-700">
                  Highlight as "On Sale" item
                </span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transition-all font-medium"
                >
                  Apply Discount
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DealsDiscount;
