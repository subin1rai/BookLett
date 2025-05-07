import React from "react";
import { X, Check } from "lucide-react";

const AddBanner = ({
  isOpen,
  isEdit,
  banner,
  setBanner,
  onClose,
  onSave,
  colorOptions,
}) => {
  if (!isOpen || !banner) return null;

  const getColorClass = (color) => {
    const colorOption = colorOptions.find((option) => option.preview === color);
    return colorOption ? colorOption.preview : "bg-gray-200";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">
            {isEdit ? "Edit Banner" : "Add New Banner"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4">
          {/* Message Input */}
          <textarea
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Enter banner message"
            value={banner.message}
            onChange={(e) => setBanner({ ...banner, message: e.target.value })}
          />
          {/* Date Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={banner.startDate}
              onChange={(e) =>
                setBanner({ ...banner, startDate: e.target.value })
              }
            />
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={banner.endDate}
              onChange={(e) =>
                setBanner({ ...banner, endDate: e.target.value })
              }
            />
          </div>
          {/* Color Picker */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {colorOptions.map((color) => (
              <button
                key={color.value}
                className={`h-8 rounded-md ${color.preview} ${
                  banner.color === color.preview
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                }`}
                onClick={() => setBanner({ ...banner, color: color.bg })}
              />
            ))}
          </div>
          {/* Text Color Picker */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Text Color</p>
            <div className="flex gap-2">
              <button
                key="white"
                onClick={() => setBanner({ ...banner, textColor: "text-black" })}
                className={`h-8 w-8 rounded-full border-2 ${
                  banner.textColor === "text-black" ? "border-blue-600" : "border-gray-300"
                } bg-white`}
                title="White"
              />
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setBanner({ ...banner, textColor: color.text })}
                  className={`h-8 w-8 rounded-full border-2 ${
                    banner.textColor === color.text
                      ? "border-blue-600"
                      : "border-gray-300"
                  } ${color.preview}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          {/* Preview Section */}
          <div
            className={`mb-4 rounded-md px-4 py-2 text-center shadow-md items-center ${banner.color || "bg-gray-200"} 
            `}
          >
            <div className="flex justify-center items-center gap-2">
              <p className="text-white font-medium">{banner.message || "Banner preview text"}</p>
              <span
                className={`${banner.textColor || "text-white"} font-bold text-lg`}
              >
                Shop →
              </span>
            </div>
          </div>
          {/* Active Switch */}
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={banner.IsPinned}
              onChange={() => setBanner({ ...banner, IsPinned: !banner.IsPinned })}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:absolute after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all relative" />
            <span className="ml-3 text-sm">
                Active
            </span>
          </label>
        </div>
        <div className="border-t px-6 py-4 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-md">
            Cancel
          </button>
          <button
            onClick={() => {
              console.log("Submitting banner data:", banner);
              onSave(banner);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
          >
            <Check size={18} className="mr-2" />
            {isEdit ? "Save Changes" : "Add Banner"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBanner;
