import React, { useState } from "react";
import OrderItem from "./OrderItem";

const OrderCard = ({ order, onCancelOrder }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-purple-100 text-purple-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canCancel = order.status === "Pending";

  return (
    <div className="mb-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Order #{order.orderId}</h3>
            <p className="text-sm text-gray-500">
              Placed on {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-800"
            >
              {expanded ? "Hide Details" : "Show Details"}
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="p-4 bg-gray-50">
          <div className="mb-4">
            <h4 className="font-medium mb-2">Order Items</h4>
            <div className="bg-white rounded border border-gray-200">
              <div className="flex justify-between items-center p-2 bg-gray-100 text-sm font-medium">
                <div className="flex-1">Item</div>
                <div className="flex-1 text-center">Price</div>
                <div className="flex-1 text-center">Qty</div>
                <div className="flex-1 text-right">Subtotal</div>
              </div>
              {order.orderItems.map((item) => (
                <OrderItem key={item.orderId} item={item} />
              ))}
              <div className="flex justify-end p-3 bg-gray-50 border-t border-gray-200">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-lg font-medium">
                    Rs.{order.finalTotal}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {canCancel && (
            <div className="flex justify-end">
              <button
                onClick={() => onCancelOrder(order.orderId)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
