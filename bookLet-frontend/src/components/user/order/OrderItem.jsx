import { ShoppingBag } from "lucide-react";
import React from "react";
const OrderItem = ({ item }) => {
  return (
    <div className="flex justify-between items-center p-3 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3 flex-1">
        <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
          <ShoppingBag size={16} className="text-gray-500" />
        </div>
        <div>
          <p className="font-medium text-gray-800">{item.title}</p>
          <p className="text-xs text-gray-500">
            {item.itemCode || "SKU123456"}
          </p>
        </div>
      </div>
      <div className="flex-1 text-center">
        <p className="text-sm font-medium">
          Rs. {item.totalPrice.toLocaleString()}
        </p>
      </div>
      <div className="flex-1 text-center">
        <span className="inline-flex items-center justify-center h-6 w-10 bg-gray-100 rounded text-sm font-medium">
          {item.quantity}
        </span>
      </div>
      <div className="flex-1 text-right">
        <p className="text-sm font-medium text-gray-800">
          Rs. {(item.totalPrice * item.quantity).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
