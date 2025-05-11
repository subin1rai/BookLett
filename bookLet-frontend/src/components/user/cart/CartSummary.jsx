import React, { useState } from "react";
import { BadgePercent, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // ← import navigate hook
import apiClient from "../../../api/axios";

const CartSummary = ({ mergedCart }) => {
  const [showAllDiscounts, setShowAllDiscounts] = useState(false);
  const [loading, setLoading] = useState(false); // ← loading state
  const navigate = useNavigate(); // ← for navigation

  const discounts = [
    { name: "+5 Books Member Discount", value: "5%" },
    { name: "10 successful orders Discount", value: "10%" },
    { name: "Special Offers", value: "20%" },
    { name: "First-time buyer bonus", value: "5%" },
    { name: "Seasonal discount", value: "8%" },
  ];

  const visibleDiscounts = showAllDiscounts ? discounts : discounts.slice(0, 2);
  const hiddenCount = discounts.length - 2;

  const subtotal =
    mergedCart?.reduce(
      (acc, item) => acc + item.book.price * item.quantity,
      0
    ) || 0;
  const total = subtotal;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await apiClient.post(
        "/order/place",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.statusCode == 200) {
        toast.success(data.message);
        setTimeout(() => {
          navigate(-1); // go back
        }, 1000); // delay to show toast
      }
    } catch (error) {
      toast.error("Order failed. Please try again.");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="w-full bg-gray-100 rounded-lg p-4 mb-4">
        <h1 className="text-lg font-semibold mb-2">Selected Offer Summary</h1>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm">
            <p className="text-gray-400">Proposed total</p>
            <p className="font-bold">Rs.{subtotal}</p>
          </div>
          <hr className="border-gray-300 my-1" />
          <div className="flex justify-between items-center">
            <p className="text-gray-400 font-semibold">TOTAL</p>
            <p className="font-bold text-2xl">Rs.{total}</p>
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <BadgePercent size={16} />
            <h2 className="text-base font-semibold">Discounts Applied</h2>
          </div>
          <div className="text-xs font-semibold bg-web-primary border border-gray-700 px-3 py-0.5 rounded-full">
            {discounts.length} available
          </div>
        </div>

        <div className="mb-4">
          <div className="space-y-2">
            {visibleDiscounts.map((discount, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-web-offer rounded-full mr-2"></span>
                  <p>{discount.name}</p>
                </div>
                <p className="font-medium text-web-discount">
                  {discount.value}
                </p>
              </div>
            ))}

            {discounts.length > 2 && (
              <button
                onClick={() => setShowAllDiscounts(!showAllDiscounts)}
                className="w-full mt-2 flex items-center justify-center gap-1 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 border-t border-gray-200"
              >
                {showAllDiscounts ? (
                  <>
                    <ChevronUp size={14} />
                    <span>Show less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} />
                    <span>
                      Show {hiddenCount} more discount
                      {hiddenCount !== 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 font-bold text-lg rounded-lg mt-4 ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-web-primary"
              }`}
            >
              {loading ? "Processing..." : "Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
