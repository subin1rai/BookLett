import React, { useState, useContext } from "react";
import { BookCheck, HelpCircle } from "lucide-react";
import { AppContext } from "../../../context/AppContext";
import { toast } from "react-toastify";

const BookToCart = ({ book }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(AppContext);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const addCart = async () => {
    try {
      const data = {
        bookId: book.bookId,
        quantity
      };
      addToCart(data);
    } catch (error) {
        toast.error("Failed to Add")
    }
  };

  return (
    <div className="border p-3 rounded-lg border-gray-100">
      <div className="h-[200px] w-[270px] overflow-hidden rounded-xl mb-3">
        <img
          className="h-[200px] w-[270px]"
          src={book.imageUrl}
          alt={book.title}
        />
      </div>
      <div className="flex flex-row justify-between items-center px-4 mb-4">
        <div className="flex flex-row items-center gap-2">
          <BookCheck />
          <div>
            <p className="font-semibold">Available Within</p>
            <p className="text-gray-400 text-sm">1 to 2 days</p>
          </div>
        </div>
        <HelpCircle />
      </div>
      <hr />
      <p className="mt-4 px-4 font-semibold text-xl">Rs.{book.price}</p>
      <div className="flex items-center gap-1 justify-between bg-gray-100 px-3 py-2 rounded-md mx-5">
        <button
          onClick={handleDecrease}
          className="text-lg font-medium flex h-7 w-7 items-center justify-center bg-white shadow-lg rounded-full"
        >
          -
        </button>
        <span className="w-6 text-center font-semibold">QTY:{quantity}</span>
        <button
          onClick={handleIncrease}
          className="text-lg font-medium flex h-7 w-7 items-center justify-center bg-white shadow-lg rounded-full"
        >
          +
        </button>
      </div>
      <button onClick={addCart} className="bg-web-secondary w-full font-semibold text-gray-100 py-2 rounded-md mt-4 ">
        ADD TO CART
      </button>
    </div>
  );
};

export default BookToCart;
