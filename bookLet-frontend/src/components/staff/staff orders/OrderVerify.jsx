import React, { useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../../../api/axios";

const OrderVerify = ({ order, onClose }) => {
  const [claimCode, setClaimCode] = useState("");

  const handleVerify = async () => {
    try {
      const response = await apiClient.put(
        `/staff/verifyOrder/${order.orderId}`,
        {
          claimCode,
        }
      );

      if (response.data.status === "success") {
        toast.success("Order verified successfully");
        onClose();
      } else {
        toast.error(response.data.message || "Verification failed");
      }
    } catch (error) {
      toast.error("Verification error");
    }
  };

  return (
    <div className="">
      <div className="flex flex-col items-center">
        <div className="flex flex-row justify-between items-center w-full">
          <p></p>
          <h1 className="text-2xl font-bold ">Verify Order</h1>
          <button onClick={onClose}>x</button>
        </div>
        <h2 className="text-sm font-medium">Order Id: {order.orderId}</h2>
      </div>
      <div className="flex flex-col mt-3 gap-2">
        <p className="font-semibold text-lg">Claim Code</p>
        <input
          type="text"
          value={claimCode}
          onChange={(e) => setClaimCode(e.target.value)}
          placeholder="Enter claim code"
          className="border border-dashed border-black bg-gray-100 rounded px-4 py-2"
        />
        <button
          onClick={handleVerify}
          className="bg-web-secondary text-web-primary text-lg font-semibold px-4 py-3 rounded mt-5"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default OrderVerify;
