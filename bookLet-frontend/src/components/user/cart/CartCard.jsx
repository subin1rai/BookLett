import React, { useContext } from "react";
import images from "../../../assets/assets";
import { Trash2Icon } from "lucide-react";
import Loading from "../../basic components/Loading";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";
import apiClient from "../../../api/axios";

const CartCard = ({ carts }) => {
  const { updateCartQuantity, getCart } = useContext(AppContext);

  const token = localStorage.getItem("token");

  const handleIncrease = () => {
    const newQuantity = carts.quantity + 1;
    updateCartQuantity(carts.bookId, newQuantity);
    updateCart(newQuantity);
  };

  const handleDecrease = () => {
    if (carts.quantity > 1) {
      const newQuantity = carts.quantity - 1;
      updateCartQuantity(carts.bookId, newQuantity);
      updateCart(newQuantity);
    }
  };

  const updateCart = async (newQuantity) => {
    try {
      const cartQuantity = newQuantity;
      const { data } = await apiClient.put(
        `/addToCart/update/${carts.cartItemId}`,
        { quantity: cartQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRemove = async () => {
    try {
      const { data } = await apiClient.delete(
        `/addToCart/remove/${carts.cartItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.statusCode == 200) {
        toast.success(data.message);
        getCart();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return carts ? (
    <div className="w-full mb-4">
      <div className="flex flex-row gap-32 items-center justify-between border border-gray-200 px-5 py-4 rounded-xl">
        {/* Book Info Section */}
        <div className="flex items-center gap-6">
          <img
            className="w-32 h-24 object-cover rounded"
            src={images.book2}
            alt={carts.book.title}
          />
          <div>
            <h1 className="text-xl font-semibold mb-1">{carts.book.title}</h1>
            <p className="text-gray-600">by {carts.book.author}</p>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-6">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-md">
            <button
              onClick={handleDecrease}
              className="text-lg font-medium w-6 h-6 flex items-center justify-center"
            >
              -
            </button>
            <span className="w-6 text-center">{carts.quantity}</span>
            <button
              onClick={handleIncrease}
              className="text-lg font-medium w-6 h-6 flex items-center justify-center"
            >
              +
            </button>
          </div>

          {/* Price Info */}
          <div className="w-20 text-right">
            <p className="font-medium">NRS.{carts.book.price}</p>
          </div>

          {/* Total Info */}
          <div className="w-24 text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-medium">
              NRS.{carts.book.price * carts.quantity}
            </p>
          </div>

          {/* Delete Button */}
          <button className="ml-2 p-1 hover:text-red-500 transition-colors">
            <Trash2Icon size={20} onClick={handleRemove} />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default CartCard;
