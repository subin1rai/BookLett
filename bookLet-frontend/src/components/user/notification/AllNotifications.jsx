import React from "react";

const AllNotifications = ({ notification }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };
  return (
    <div className="border-b p-1 mb-3 mr-3">
      <p className="text-sm">{notification.message}</p>
      <p className="text-sm">{formatDate(notification.createdAt)}</p>
    </div>
  );
};

export default AllNotifications;
