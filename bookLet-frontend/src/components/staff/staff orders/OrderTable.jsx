import { EyeIcon } from "lucide-react";
import React from "react";

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusClass = (label) => {
  switch (label) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Completed":
      return "bg-web-primary text-gray-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderTable = ({ orders, onVerify }) => {
  return (
    <table className="min-w-full border text-sm">
      <thead>
        <tr className="bg-gray-50 text-left text-gray-500">
          <th className="py-3 px-4">#</th>
          <th className="py-3 px-4">Order By</th>
          <th className="py-3 px-4">Order Date</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Discount (%)</th>
          <th className="py-3 px-4">Original Price</th>
          <th className="py-3 px-4">Final Price</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order, index) => (
          <tr key={order.orderId} className="border-t">
            <td className="py-2 px-4">{index + 1}</td>
            <td className="py-2 px-4">{order.username}</td>
            <td className="py-2 px-4">{formatDate(order.orderDate)}</td>
            <td className="py-2 px-4">
              <span
                className={`px-2 py-1 rounded-full text-xs ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </td>
            <td className="py-2 px-4">{order.discountRate}%</td>
            <td className="py-2 px-4">Rs.{order.originalTotal}</td>
            <td className="py-2 px-4">Rs.{order.finalTotal}</td>
            <td className="py-2 px-4 flex flex-row items-center gap-3">
              <button onClick={"/staff/orders/orderDetails"}>
                <EyeIcon className="h-5" />
              </button>
              {order.status === "Completed" || order.status === "Cancelled" ? (
                <p>--</p>
              ) : (
                <button
                  onClick={() => onVerify(order)}
                  className="bg-web-primary text-gray-900 font-semibold px-3 py-1 rounded"
                >
                  Verify
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTable;
