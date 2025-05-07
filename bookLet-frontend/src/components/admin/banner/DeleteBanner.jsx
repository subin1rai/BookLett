import React from "react";
import { AlertCircle } from "lucide-react";

const DeleteBanner = ({ banner, onCancel, onConfirm }) => {
  if (!banner) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
            <AlertCircle className="text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Banner
          </h3>
          <p className="text-gray-500 mb-4">
            Are you sure you want to delete this banner?
          </p>
          <p className="text-sm bg-gray-100 p-3 rounded mb-6 text-gray-700">
            "{banner.message}"
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={onCancel} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteBanner;
