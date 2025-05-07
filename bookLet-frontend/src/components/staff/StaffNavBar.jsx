import React from "react";
import {
  LogOut,
  List,
  Book,
  ShoppingBag,
  User,
  Users,
  ListCheck,
  Settings,
  ScrollText,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import images from "../../assets/assets";

const StaffNavBar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/staff", icons: List },
    { name: "Orders", path: "/staff/orders", icons: ShoppingBag },
    { name: "Customers", path: "/staff/customers", icons: User },
    { name: "Settings", path: "/staff/settings", icons: Settings },
  ];

  return (
    <div className="md:w-64 w-16 bg-web-third border-r min-h-screen text-base  pb-2 flex flex-col">
      <div className="flex flex-row h-20 items-center gap-3 bg-web-secondary">
        <div className="bg-white rounded-full p-1 ml-5">
          <img className="h-[40px]" src={images.logo} alt="logo" />
        </div>
        <span className="font-bold text-3xl text-white hidden md:block">
          Booklett
        </span>
      </div>
      <div className="h-5" />
      {menuItems.map((item) => {
        const Icon = item.icons;
        return (
          <NavLink
            to={item.path}
            key={item.name}
            end={item.path === "/staff"}
            className={({ isActive }) =>
              `flex items-center text-xl md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${
                isActive
                  ? "bg-web-secondary font-semibold text-white border-r-[6px] border-web-discount"
                  : "hover:bg-web-secondary/50 border-r-[6px] border-transparent"
              }`
            }
          >
            <div className="bg-gray-400 rounded-full p-1">
              <Icon className="text-white" />
            </div>
            <p className="md:block hidden text-center">{item.name}</p>
          </NavLink>
        );
      })}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          window.location.href = "/";
        }}
        className="flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 hover:bg-red-100 border-r-[6px] border-white hover:border-red-300 mt-auto"
      >
        <LogOut />
        <p className="md:block hidden text-center text-red-600">Logout</p>
      </button>
    </div>
  );
};

export default StaffNavBar;
