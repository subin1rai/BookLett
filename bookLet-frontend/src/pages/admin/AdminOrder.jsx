import React, { useEffect, useState } from "react";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await apiClient.get("/order/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(data);
        if (data.status === "success") {
          setOrders(data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch orders");
      }
    };
    fetchOrders();

    setLoading(false);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleStatusChange = (idx, newStatus) => {
    const newOrders = [...orders];
    newOrders[idx].status = newStatus;
    setOrders(newOrders);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 font-semibold text-center">
                    Order ID
                  </th>
                  <th className="px-3 py-2 font-semibold text-center">
                    User ID
                  </th>
                  <th className="px-3 py-2 font-semibold text-center">
                    Order Date
                  </th>
                  <th className="px-3 py-2 font-semibold text-center">
                    Total Amount
                  </th>
                  <th className="px-3 py-2 font-semibold text-center">
                    Discount Rate
                  </th>
                  <th className="px-3 py-2 font-semibold text-center">
                    Final Total Amount
                  </th>
                  <th className="px-3 py-2 font-semibold text-center">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-300 py-3">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order, idx) => (
                    <tr
                      key={order.orderid}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-3 py-2 text-center">{order.orderid}</td>
                      <td className="px-3 py-2 text-center">{order.userId}</td>
                      <td className="px-3 py-2 text-center">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        Rs.{order.originalTotal}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {order.discountRate}%
                      </td>
                      <td className="px-3 py-2 text-center">
                        Rs.{order.finalTotal}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(idx, e.target.value)
                          }
                          className={`border rounded px-2 py-1 text-xs font-semibold
                            ${
                              order.status === "Completed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }
                          `}
                          style={{
                            minWidth: 100,
                            borderRadius: 9999,
                            fontWeight: 600,
                            borderWidth: 2,
                            borderColor:
                              order.status === "Completed"
                                ? "#22c55e"
                                : order.status === "Pending"
                                ? "#eab308"
                                : "#ef4444",
                          }}
                        >
                          <option
                            value="Pending"
                            className="text-yellow-700 bg-yellow-100"
                          >
                            Pending
                          </option>
                          <option
                            value="Completed"
                            className="text-green-700 bg-green-100"
                          >
                            Completed
                          </option>
                          <option
                            value="Cancelled"
                            className="text-red-700 bg-red-100"
                          >
                            Cancelled
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrder;
