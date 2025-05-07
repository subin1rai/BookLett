import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import images from "../../assets/assets";

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      // Fetch logic here
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {}, []);

  // Example data; replace with your fetch logic
  const [recentBooks, setRecentBooks] = useState([
    {
      id: 1,
      title: "React Basics",
      author: "Dan Abramov",
      added: "2024-06-01",
    },
    {
      id: 2,
      title: "Advanced JS",
      author: "Kyle Simpson",
      added: "2024-06-02",
    },
  ]);
  const [recentOrders, setRecentOrders] = useState([
    { id: 101, customer: "Alice", date: "2024-06-03", amount: "$49.99" },
    { id: 102, customer: "Bob", date: "2024-06-04", amount: "$29.99" },
  ]);
  const [recentCustomers, setRecentCustomers] = useState([
    {
      id: 201,
      name: "Charlie",
      email: "charlie@mail.com",
      joined: "2024-06-01",
    },
    { id: 202, name: "Dana", email: "dana@mail.com", joined: "2024-06-02" },
  ]);
  const [recentStaffs, setRecentStaffs] = useState([
    { id: 301, name: "Eve", role: "Admin", joined: "2024-06-01" },
    { id: 302, name: "Frank", role: "Manager", joined: "2024-06-02" },
  ]);

  // Example total numbers; replace with your real counts
  const totalBooks = 120;
  const totalOrders = 87;
  const totalCustomers = 45;
  const totalStaffs = 8;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Top: Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="flex items-center p-5 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
          <img src={images.logo} className="w-10 h-10 mr-4" alt="Books" />
          <div>
            <p className="text-2xl font-bold text-gray-700">{totalBooks}</p>
            <p className="text-gray-500">Books</p>
          </div>
        </div>
        <div className="flex items-center p-5 bg-white rounded-lg shadow-md border-l-4 border-green-500">
          <img src={images.arrow} className="w-10 h-10 mr-4" alt="Orders" />
          <div>
            <p className="text-2xl font-bold text-gray-700">{totalOrders}</p>
            <p className="text-gray-500">Orders</p>
          </div>
        </div>
        <div className="flex items-center p-5 bg-white rounded-lg shadow-md border-l-4 border-yellow-500">
          <img
            src={images.user_icon}
            className="w-10 h-10 mr-4"
            alt="Customers"
          />
          <div>
            <p className="text-2xl font-bold text-gray-700">{totalCustomers}</p>
            <p className="text-gray-500">Customers</p>
          </div>
        </div>
        <div className="flex items-center p-5 bg-white rounded-lg shadow-md border-l-4 border-purple-500">
          <img src={images.user_icon} className="w-10 h-10 mr-4" alt="Staffs" />
          <div>
            <p className="text-2xl font-bold text-gray-700">{totalStaffs}</p>
            <p className="text-gray-500">Staffs</p>
          </div>
        </div>
      </div>

      {/* Bottom: Recent Records as Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Books Table */}
        <div className="bg-white rounded-xl shadow-md p-5 border-t-4 border-blue-500">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <img src={images.logo} alt="Books" className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              Recently Added Books
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-3 py-2 text-left font-semibold text-blue-700">
                    Title
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-blue-700">
                    Author
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-blue-700">
                    Added On
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBooks.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-300 py-3">
                      No recent books.
                    </td>
                  </tr>
                )}
                {recentBooks.slice(0, 5).map((book) => (
                  <tr key={book.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2">{book.title}</td>
                    <td className="px-3 py-2">{book.author}</td>
                    <td className="px-3 py-2">{book.added}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-xl shadow-md p-5 border-t-4 border-green-500">
          <div className="flex items-center mb-3">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <img src={images.arrow} alt="Orders" className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              Recent Orders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-50">
                  <th className="px-3 py-2 text-left font-semibold text-green-700">
                    Order ID
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-green-700">
                    Customer
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-green-700">
                    Date
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-green-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-gray-300 py-3">
                      No recent orders.
                    </td>
                  </tr>
                )}
                {recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2">#{order.id}</td>
                    <td className="px-3 py-2">{order.customer}</td>
                    <td className="px-3 py-2">{order.date}</td>
                    <td className="px-3 py-2">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Customers Table */}
        <div className="bg-white rounded-xl shadow-md p-5 border-t-4 border-yellow-500">
          <div className="flex items-center mb-3">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <img src={images.user_icon} alt="Customers" className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              New Customers
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-yellow-50">
                  <th className="px-3 py-2 text-left font-semibold text-yellow-700">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-yellow-700">
                    Email
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-yellow-700">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentCustomers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-300 py-3">
                      No recent customers.
                    </td>
                  </tr>
                )}
                {recentCustomers.slice(0, 5).map((customer) => (
                  <tr key={customer.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2">{customer.name}</td>
                    <td className="px-3 py-2">{customer.email}</td>
                    <td className="px-3 py-2">{customer.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Staffs Table */}
        <div className="bg-white rounded-xl shadow-md p-5 border-t-4 border-purple-500">
          <div className="flex items-center mb-3">
            <div className="bg-purple-100 p-2 rounded-full mr-3">
              <img src={images.user_icon} alt="Staffs" className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">New Staffs</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-purple-50">
                  <th className="px-3 py-2 text-left font-semibold text-purple-700">
                    Name
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-purple-700">
                    Role
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-purple-700">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentStaffs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center text-gray-300 py-3">
                      No recent staffs.
                    </td>
                  </tr>
                )}
                {recentStaffs.slice(0, 5).map((staff) => (
                  <tr key={staff.id} className="border-b last:border-b-0">
                    <td className="px-3 py-2">{staff.name}</td>
                    <td className="px-3 py-2">{staff.role}</td>
                    <td className="px-3 py-2">{staff.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
