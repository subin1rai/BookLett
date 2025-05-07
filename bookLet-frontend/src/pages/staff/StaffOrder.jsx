import React, { useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../../api/axios";

const StaffOrder = () => {
  const [order, setOrder] = useState([]);
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const { data } = await apiClient.get("/order/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <h1>Staff Order </h1>
    </div>
  );
};

export default StaffOrder;
