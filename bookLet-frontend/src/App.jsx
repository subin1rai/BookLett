import { ToastContainer } from "react-toastify";
import React, { useEffect } from "react";
import { Routes, Route, useMatch, useNavigate } from "react-router-dom";
import NavBar from "./components/user/NavBar";
import Home from "./pages/user/Home";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrder from "./pages/admin/AdminOrder";
import Admin from "./pages/admin/Admin";
import AdminBook from "./pages/admin/AdminBook";
import AddBooks from "./pages/admin/AddBooks";
import EditBooks from "./pages/admin/EditBooks";
import BookDetail from "./pages/admin/BookDetails";
import Wishlist from "./pages/user/wishlist";
import BookList from "./pages/user/Books";
import Cart from "./pages/user/Cart";
import Banner from "./pages/admin/Banner";
import Footer from "./components/user/Footer";
import Staff from "./pages/staff/Staff";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffOrder from "./pages/staff/StaffOrder";
import BookDetails from "./pages/user/BookDetails";
import AuthenticatedRoute from "./components/basic components/AuthenticatedRoute";
import MyOrders from "./pages/user/MyOrders";
import Member from "./pages/admin/UserList";
import StaffList from "./pages/admin/StaffList";
import NotificationComponent from "./components/user/NotificationComponent";

const App = () => {
  const isAdminRoute = useMatch("/admin/*");
  const isStaffRoute = useMatch("/staff/*");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "Admin" && !location.pathname.startsWith("/admin")) {
      navigate("/admin");
    } else if (role === "Staff" && !location.pathname.startsWith("/staff")) {
      navigate("/staff");
    }
  }, [role, navigate]);
  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {!isAdminRoute && !isStaffRoute && <NavBar />}
      {!isAdminRoute && !isStaffRoute && <NotificationComponent />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/myOrders" element={<MyOrders />} />
        <Route path="/bookDetails/:bookId" element={<BookDetails />} />
        <Route element={<AuthenticatedRoute />}>
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route path="/admin" element={<Admin />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<AdminBook />} />
          <Route path="/admin/orders" element={<AdminOrder />} />
          <Route path="/admin/users" element={<Member />} />
          <Route path="/admin/staff" element={<StaffList />} />
          <Route path="/admin/banners" element={<Banner />} />
          <Route path="/admin/reports" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          <Route path="/admin/books/addBooks" element={<AddBooks />} />
          <Route path="/admin/books/edit/:bookId" element={<EditBooks />} />
          <Route path="/admin/books/view/:bookId" element={<BookDetail />} />
        </Route>
        <Route path="/staff" element={<Staff />}>
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/orders" element={<StaffOrder />} />
        </Route>
      </Routes>
      {!isAdminRoute && !isStaffRoute && <Footer />}
    </div>
  );
};

export default App;
