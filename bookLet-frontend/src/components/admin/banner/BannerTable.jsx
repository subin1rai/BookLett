import React from "react";
import { Edit2, Trash2, Eye, Calendar } from "lucide-react";

const BannerTable = ({
  banners,
  onEdit,
  onDelete,
  onPreview,
  onToggle,
  getStatus,
  getColorClass,
  formatDate,
}) => {
  return (
    <table className="min-w-full">
      <thead>
        <tr className="bg-gray-50 text-left text-sm text-gray-500">
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Message</th>
          <th className="py-3 px-4">Date Range</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {banners.map((banner) => {
          const status = getStatus(banner);
          return (
            <tr key={banner.id}>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${status.class}`}
                >
                  {status.label}
                </span>
              </td>
              <td className="py-4 px-4 max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                {banner.message}
              </td>
              
              <td className="py-4 px-4 text-sm text-gray-600 flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(banner.startDate)} - {formatDate(banner.endDate)}
              </td>
              <td className="py-4 px-4 space-x-3">
                <button
                  onClick={() => onPreview(banner)}
                  className="text-gray-500 hover:text-black"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onEdit(banner)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete(banner)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default BannerTable;
