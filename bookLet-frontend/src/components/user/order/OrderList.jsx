import React, { useState } from "react";
import OrderCard from "./OrderCard";
import { ChevronDown, Filter, ShoppingBag } from "lucide-react";

const OrderList = ({ orders, onCancelOrder }) => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter orders based on status
  const filteredOrders = orders.filter(
    (order) => filterStatus === "All" || order.status === filterStatus
  );

  // Sort orders based on selected criteria
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.orderDate).getTime();
      const dateB = new Date(b.orderDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    } else if (sortBy === "total") {
      return sortOrder === "asc"
        ? a.finalTotal - b.finalTotal
        : b.finalTotal - a.finalTotal;
    }
    return 0;
  });

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-1">
          No orders yet
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          When you place your first order, it will appear here for you to track
          and manage.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Orders</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <Filter
              size={16}
              className="absolute right-2 top-2.5 text-gray-400 pointer-events-none"
            />
          </div>

          <div className="relative">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split("-");
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="total-desc">Highest Amount</option>
              <option value="total-asc">Lowest Amount</option>
            </select>
            <ChevronDown
              size={16}
              className="absolute right-2 top-2.5 text-gray-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sortedOrders.map((order) => (
          <OrderCard
            key={order.orderId}
            order={order}
            onCancelOrder={onCancelOrder}
          />
        ))}
      </div>

      {sortedOrders.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Showing {sortedOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
};

export default OrderList;
