import React from "react";
import StaffNavBar from "../../components/staff/StaffNavBar";
import StaffHeader from "../../components/staff/StaffHeader";
import { Outlet } from "react-router-dom";

const Staff = () => {
  return (
    <div className="text-default min-h-screen bg-white flex">
      <div className="sticky top-0 h-screen md:w-64 w-16 bg-web-third border-r border-gray-500">
        <StaffNavBar />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <StaffHeader />
        </div>
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Staff;
