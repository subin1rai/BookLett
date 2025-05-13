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

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);

  // Example data; replace with your fetch logic
  const [recentBooks, setRecentBooks] = useState([
    {
      id: 1,
      title: "React Basics",
      author: "Dan Abramov",
      added: "2024-06-01",
      price: "$29.99",
      sales: 124,
      status: "In Stock",
    },
    {
      id: 2,
      title: "Advanced JS",
      author: "Kyle Simpson",
      added: "2024-06-02",
      price: "$34.99",
      sales: 87,
      status: "Low Stock",
    },
    {
      id: 3,
      title: "CSS Mastery",
      author: "Rachel Andrew",
      added: "2024-06-03",
      price: "$24.99",
      sales: 56,
      status: "In Stock",
    },
  ]);

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 101,
      customer: "Alice Johnson",
      date: "2024-06-03",
      amount: "$49.99",
      status: "Completed",
    },
    {
      id: 102,
      customer: "Bob Smith",
      date: "2024-06-04",
      amount: "$29.99",
      status: "Processing",
    },
    {
      id: 103,
      customer: "Carol Williams",
      date: "2024-06-05",
      amount: "$64.99",
      status: "Pending",
    },
  ]);

  const [recentCustomers, setRecentCustomers] = useState([
    {
      id: 201,
      name: "Charlie Davis",
      email: "charlie@mail.com",
      joined: "2024-06-01",
      orders: 5,
      total: "$249.95",
    },
    {
      id: 202,
      name: "Dana Wilson",
      email: "dana@mail.com",
      joined: "2024-06-02",
      orders: 2,
      total: "$89.98",
    },
    {
      id: 203,
      name: "Eli Thompson",
      email: "eli@mail.com",
      joined: "2024-06-04",
      orders: 1,
      total: "$34.99",
    },
  ]);

  const [recentStaffs, setRecentStaffs] = useState([
    {
      id: 301,
      name: "Eve Anderson",
      role: "Admin",
      joined: "2024-06-01",
      department: "Management",
    },
    {
      id: 302,
      name: "Frank Moore",
      role: "Manager",
      joined: "2024-06-02",
      department: "Sales",
    },
    {
      id: 303,
      name: "Grace Lee",
      role: "Staff",
      joined: "2024-06-03",
      department: "Support",
    },
  ]);

  // Summary total numbers
  const totalBooks = 120;
  const totalOrders = 87;
  const totalCustomers = 45;
  const totalStaffs = 8;

  // Monthly revenue data
  const monthlyRevenue = [
    { month: "Jan", revenue: 12500 },
    { month: "Feb", revenue: 14200 },
    { month: "Mar", revenue: 10800 },
    { month: "Apr", revenue: 13600 },
    { month: "May", revenue: 18900 },
    { month: "Jun", revenue: 16700 },
  ];

  // Sales data for the chart
  const salesData = [
    { name: "Mon", sales: 12 },
    { name: "Tue", sales: 19 },
    { name: "Wed", sales: 15 },
    { name: "Thu", sales: 25 },
    { name: "Fri", sales: 22 },
    { name: "Sat", sales: 30 },
    { name: "Sun", sales: 18 },
  ];

  // Notifications
  const notifications = [
    {
      id: 1,
      message: "New order #104 received",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: 2,
      message: "Customer Dana updated profile",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      message: "Low stock alert for 'Advanced JS'",
      time: "3 hours ago",
      read: true,
    },
    {
      id: 4,
      message: "Monthly reports ready for review",
      time: "Yesterday",
      read: true,
    },
  ];

  // Card data for summary
  const summaryCards = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: <Book className="text-blue-500" />,
      change: "+12%",
      isPositive: true,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      iconBg: "bg-blue-100",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: <ShoppingCart className="text-green-500" />,
      change: "+8%",
      isPositive: true,
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      iconBg: "bg-green-100",
    },
    {
      title: "Total Customers",
      value: totalCustomers,
      icon: <Users className="text-purple-500" />,
      change: "+15%",
      isPositive: true,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-500",
      iconBg: "bg-purple-100",
    },
    {
      title: "Total Revenue",
      value: "$16,789",
      icon: <DollarSign className="text-amber-500" />,
      change: "+23%",
      isPositive: true,
      bgColor: "bg-amber-50",
      borderColor: "border-amber-500",
      iconBg: "bg-amber-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <p className="text-gray-600">
            Welcome back, <span className="text-lg text-blue-600 font-bold">Admin</span>! Here's what's happening with your store today.
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
              <div className="mt-4 flex items-center">
                {card.isPositive ? (
                  <ChevronUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    card.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {card.change} since last month
                </span>
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
              <select className="bg-gray-100 border-0 text-gray-600 rounded-md py-1 px-3 text-sm">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
              </select>
            </div>
            <div className="h-64 w-full flex items-end justify-between">
              {salesData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="bg-indigo-500 hover:bg-indigo-600 rounded-t-md w-12 transition-all"
                    style={{ height: `${(item.sales / 30) * 180}px` }}
                  ></div>
                  <p className="text-xs text-gray-600 mt-2">{item.name}</p>
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
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-5">
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    New order #105 received
                  </p>
                  <p className="text-xs text-gray-500">10 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 mr-4">
                  <Book className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Book "React Basics" reached 100+ sales
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-2 mr-4">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    5 new customers registered
                  </p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-amber-100 rounded-full p-2 mr-4">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Monthly revenue goal achieved
                  </p>
                  <p className="text-xs text-gray-500">2 days ago</p>
                </div>
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Sales
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            book.status === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : book.status === "Low Stock"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {book.sales}
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
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.amount}
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

          {/* Recent Customers Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">
                  New Customers
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Joined
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Orders
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Total Spent
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-600">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {customer.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.joined}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.total}
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

          {/* Recent Staffs Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-amber-100 p-2 rounded-lg mr-3">
                  <UserPlus className="h-5 w-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">New Staff</h2>
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
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Department
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Joined
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentStaffs.map((staff) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-amber-600">
                              {staff.name.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {staff.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            staff.role === "Admin"
                              ? "bg-red-100 text-red-800"
                              : staff.role === "Manager"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {staff.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {staff.joined}
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
