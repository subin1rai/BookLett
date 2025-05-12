import React from "react";
const OrderItem = ({ item }) => {
  return (
    <div className="flex justify-between items-center p-2 border-b border-gray-200">
      <div className="flex-1">
        <p className="text-sm font-medium">{item.title}</p>
      </div>
      <div className="flex-1 text-center">
        <p className="text-sm">Rs.{item.totalPrice}</p>
      </div>
      <div className="flex-1 text-center">
        <p className="text-sm">{item.quantity}</p>
      </div>
      <div className="flex-1 text-right">
        <p className="text-sm font-medium">
          Rs.{(item.totalPrice * item.quantity)}
        </p>
      </div>
    </div>
  );
};

export default OrderItem;
