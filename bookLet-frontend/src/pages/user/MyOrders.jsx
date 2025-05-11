import { useEffect, useState } from "react";
import OrderList from "../../components/user/order/OrderList";
import apiClient from "../../api/axios";
import { toast } from "react-toastify";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const { data } = await apiClient.get("/order/userOrder", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data);
      if (data.status == "success") {
        setOrders(data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const handleCancelOrder = async (orderId) => {
    try {
      const { data } = await apiClient.put(
        `/order/cancel/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.statusCode == 200) {
        toast.success(data.message);
      }
    } catch (error) {
      console.log("Error Cancelling Order");
    }
  };

  return (
    <div className="px-24 bg-web-background mx-auto p-4">
      <div className="mb-6">
        <div className="">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Order History</h2>
            <span className="text-sm text-gray-500">
              {orders.length} orders
            </span>
          </div>

          <OrderList orders={orders} onCancelOrder={handleCancelOrder} />
        </div>
      </div>
    </div>
  );
}
