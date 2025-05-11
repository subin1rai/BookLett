import React from "react";
import OrderCard from "./OrderCard";

const OrderList = ({ orders, onCancelOrder }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.orderId} order={order} onCancelOrder={onCancelOrder} />
      ))}
    </div>
  );
};

export default OrderList;
