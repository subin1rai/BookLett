import React, { useState, useEffect } from "react";
import {
  Activity,
  Book,
  ShoppingCart,
  Users,
  UserPlus,
  Calendar,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  DollarSign,
  MoreHorizontal,
  Bell,
  Search,
  User,
} from "lucide-react";
import apiClient from "../../api/axios";

const AdminDashboard = () => {
  const [recentBooks, setRecentBooks] = useState([]);

  const [recentOrders, setRecentOrders] = useState([]);

  const [totalBooks, setTotalBooks] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [weekData, setWeekData] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await apiClient.get("/dashboard/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      setTotalBooks(data.totalBooks);
      setTotalOrders(data.totalOrders);
      setTotalCustomers(data.totalCustomers);
      setTotalRevenue(data.totalRevenue);
      setWeekData(data.weeklySales);
      setNotifications(data.recentNotifications || []);
      setRecentBooks(data.recentBooks || []);
      setRecentOrders(data.recentOrders || []);
    } catch (error) {
      console.log("Failed to fetch");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  function formatTimeAgo(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime(); // Ensure it's a timestamp
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Card data for summary
  const summaryCards = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: <Book className="text-blue-500" />,
      isPositive: true,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      iconBg: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart className="text-green-500" />,
      isPositive: true,
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      iconBg: "bg-green-100",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: <Users className="text-purple-500" />,
      isPositive: true,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
      iconBg: "bg-purple-100",
    },
    {
      title: "Total Revenue",
      value: `Rs.${totalRevenue.toFixed(2)}`,
      icon: "रू",
      isPositive: true,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-500",
      iconBg: "bg-amber-100 font-semibold text-amber-600 text-xl px-4",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-gray-600">
            Welcome back,{" "}
            <span className="text-lg text-blue-600 font-bold">User</span>!
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Top: Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-xl shadow-sm p-6 border-l-4 ${card.borderColor} transition-transform hover:scale-105`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold mt-1 text-gray-800">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.iconBg} p-3 rounded-lg`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sales Chart Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Sales Overview
              </h2>
              <h2 className="bg-gray-100 border-0 text-gray-600 rounded-md py-1 px-3 text-sm">
                <option>Last 7 Days</option>
              </h2>
            </div>
            <div className="h-64 w-full flex items-end justify-between">
              {weekData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-indigo-500 hover:bg-indigo-600 rounded-t-md w-12 transition-all"
                    style={{ height: `${(item.count / 5) * 180}px` }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">{item.day}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">
                Recent Activity
              </h2>
            </div>
            <div className="space-y-5">
              <div className="flex flex-col gap-2 items-start">
                {notifications.map((notices) => (
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-4">
                      <Book className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {notices.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(notices.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Recent Books Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Book className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Recently Added Books
                </h2>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Author
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price
                    </th>

                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {book.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          Added: {book.added}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  Recent Orders
                </h2>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map((order, idx) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.orderDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.finalTotal.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
