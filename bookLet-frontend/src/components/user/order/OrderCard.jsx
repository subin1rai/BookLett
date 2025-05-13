import React, { useState } from "react";
import OrderItem from "./OrderItem";
import { Calendar, CheckCircle, ChevronDown, ChevronUp, Clock, Package, ShoppingBag, X } from "lucide-react";

const OrderCard = ({ order, onCancelOrder }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock size={16} className="text-blue-600" />;
      case "Completed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "Cancelled":
        return <X size={16} className="text-red-600" />;
      default:
        return <Package size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const canCancel = order.status === "Pending";
  const formattedDate = new Date(order.orderDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  // Calculate order summary
  const itemCount = order.orderItems.length;
  const totalItems = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-full">
              <ShoppingBag size={20} className="text-gray-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Order #{order.orderId}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar size={14} />
                <span>{formattedDate}</span>
                <span className="text-gray-300">•</span>
                <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                order.status
              )}`}
            >
              <div className="flex items-center space-x-1">
                {getStatusIcon(order.status)}
                <span>{order.status}</span>
              </div>
            </span>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between">
          <div className="text-sm text-gray-500">
            {!expanded && (
              <span>
                {totalItems} {totalItems === 1 ? "unit" : "units"} total
              </span>
            )}
          </div>
          <div className="flex items-baseline">
            <span className="text-sm text-gray-500 mr-1">Total:</span>
            <span className="text-lg font-semibold text-gray-900">
              Rs. {order.finalTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200">
          <div className="p-4">
            <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wider mb-3">Order Details</h4>
            <div className="bg-white rounded border border-gray-200">
              <div className="flex justify-between items-center p-3 bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500">
                <div className="flex-1">Item</div>
                <div className="flex-1 text-center">Price</div>
                <div className="flex-1 text-center">Qty</div>
                <div className="flex-1 text-right">Subtotal</div>
              </div>
              {order.orderItems.map((item) => (
                <OrderItem key={item.id || item.title} item={item} />
              ))}
              <div className="flex justify-between p-4 bg-gray-50 border-t border-gray-200">
                <div className="space-y-1">
                  {order.shippingAddress && (
                    <div className="text-sm">
                      <span className="text-gray-500 font-medium">Shipping:</span> {order.shippingAddress}
                    </div>
                  )}
                  {order.paymentMethod && (
                    <div className="text-sm">
                      <span className="text-gray-500 font-medium">Payment:</span> {order.paymentMethod}
                    </div>
                  )}
                </div>
                <div className="text-right space-y-1">
                  <div className="flex justify-end text-sm">
                    <span className="text-gray-500 w-24">Subtotal:</span>
                    <span className="font-medium w-24">Rs. {(order.finalTotal - (order.shippingCost || 0)).toLocaleString()}</span>
                  </div>
                  {order.shippingCost > 0 && (
                    <div className="flex justify-end text-sm">
                      <span className="text-gray-500 w-24">Shipping:</span>
                      <span className="font-medium w-24">Rs. {order.shippingCost.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-end font-medium">
                    <span className="text-gray-800 w-24">Total:</span>
                    <span className="text-gray-900 w-24">Rs. {order.finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {canCancel && (
            <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => onCancelOrder(order.orderId)}
                className="px-4 py-2 bg-white border border-red-500 text-red-600 rounded hover:bg-red-50 transition-colors flex items-center space-x-1"
              >
                <X size={16} />
                <span>Cancel Order</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default OrderCard;
