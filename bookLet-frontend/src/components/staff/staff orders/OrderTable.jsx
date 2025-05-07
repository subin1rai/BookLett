import React from "react";

const OrderTable = ({ order, getStatus, formateDate }) => {
  return (
    <table className="min-w-full">
      <thead>
        <tr className="bg-gray-50 text-left text-sm text-gray-500">
          <th className="py-3 px-4">#</th>
          <th className="py-3 px-4">Order By</th>
          <th className="py-3 px-4">Order Date</th>
          <th className="py-3 px-4">Order Status</th>
          <th className="py-3 px-4">Claim Code</th>
          <th className="py-3 px-4">Total Amount</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody className="divided-y">
        {order.map((order, index) => {
          const status = getStatus(order);
          return (
            <tr key={order.id}>
              <td className="py-4 px-4">{index + 1}</td>
              <td className="py-4 px-4">{order.user.username}</td>
              <td className="py-4 px-4">{formateDate(order.date)}</td>
              <td className="py-4 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${status.class}`}
                >
                  {order.label}
                </span>
              </td>
              <td className="py-4 px-4">{order.claimCode}</td>
              <td className="py-4 px-4">{order.total}</td>
              <td className="py-4 px-4">
                <button>View</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default OrderTable;
