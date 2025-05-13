import React, { useContext, useEffect, useState } from "react";
import { Heart as HeartIcon, Heart as HeartFilled, Star } from "lucide-react";
import images from "../../../assets/assets";
import apiClient from "../../../api/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";

const BookCard = ({ book }) => {
  const [wish, setWish] = useState(false);

  const [timeLeft, setTimeLeft] = useState(null);
  const [showSale, setShowSale] = useState(false);
  const { addToCart, fetchWishlist, setWishlist, checkLogged } = useContext(AppContext);

  const token = localStorage.getItem("token");
  const bookId = book.bookId;

  const checkWish = async () => {
    try {
      const { data } = await apiClient.get(`/book/checkWishlist/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setWish(data.status);
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const addCart = async () => {
    try {
      const data = { bookId, quantity: 1 };
      addToCart(data);
    } catch {
      toast.error("Failed to Add");
    }
  };

  const addWish = async () => {
    try {
      const { data } = await apiClient.post(
        "/book/addWishlist",
        { bookId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.statusCode === 200) {
        toast.success("Bookmarked Successfully");
        await checkWish();
        fetchWishlist();
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  const removeWish = async () => {
    try {
      const { data } = await apiClient.put(
        `/book/remove/${bookId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (data.statusCode === 200) {
        toast.success("Removed from Wishlist");
        setWish(false);
        setWishlist((prev) => prev.filter((b) => b.bookId !== bookId));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  // On Sale Countdown Logic
  useEffect(() => {
    if (book.isOnSale && book.startTime && book.endTime) {
      const now = new Date().getTime();
      const start = new Date(book.startTime).getTime();
      const end = new Date(book.endTime).getTime();

      if (now >= start && now < end) {
        setShowSale(true);

        const interval = setInterval(() => {
          const now = new Date().getTime();
          const distance = end - now;

          if (distance <= 0) {
            setShowSale(false);
            setTimeLeft(null);
            clearInterval(interval);
          } else {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(
              `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
                seconds
              ).padStart(2, "0")}`
            );
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [book.isOnSale, book.startTime, book.endTime]);

  useEffect(() => {
    if (checkLogged()) {
      checkWish();
    }
  }, []);

  return (
    <div className="flex flex-col w-[255px] pb-8">
      <div className="relative mb-2 ">
        <Link to={`/bookDetails/${book.bookId}`} state={{ book }}>
          <img
            src={book.imageUrl? book.imageUrl : images.book2}
            alt={book.title}
            className="w-full h-[386px] object-cover rounded-[20px]"
          />
        </Link>

        {/* Show dynamic On Sale badge with countdown */}
        {showSale && timeLeft && (
          
          <div className="absolute top-0 rounded-br-2xl rounded-tl-2xl h-10 bg-web-primary ">
            <img src={images.sale1} alt="" className="w-16 absolute z-40"  />
            <h1 className="text-lg font-semibold text-web-offer pl-9 p-2 ">{timeLeft}</h1>
          </div>
        )}

        <div className="absolute top-2 right-2 rounded-full h-10 bg-web-background p-2">
          {wish ? (
            <button onClick={removeWish}>
              <HeartFilled className="text-red-500 fill-red-500" />
            </button>
          ) : (
            <button onClick={addWish}>
              <HeartIcon />
            </button>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex flex-row justify-between items-center gap-2 mb-1">
        <div className="flex items-center justify-center bg-web-primary border border-gray-500 rounded-full p-1 h-6 w-14">
          <Star className="h-4" />
          <span className="text-xs font-bold ml-0.5">4.5</span>
        </div>
        <span className="text-gray-500 text-sm">140 Reviews</span>
      </div>

      {/* Author */}
      <div className="text-xs text-gray-500 mb-1">By {book.author}</div>

      {/* Title */}
      <Link to={`/bookDetails/${book.bookId}`}>
        <h3 className="font-bold text-base mb-1 w-[250px] overflow-hidden whitespace-nowrap text-ellipsis">
          {book.title}
        </h3>
      </Link>

      {/* Price */}
      <div className="mb-2">
        <div className="text-xs text-gray-500 line-through">Rs {book.price}</div>
        <div className="flex justify-between items-center">
          <span className="font-bold">
            Rs {book.price - (book.discount * book.price) / 100}
          </span>
        {showSale && (
          <span className="text-orange-500 font-bold">{book.discount}% Off</span>
        )}  
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={addCart}
        className="bg-gray-600 text-xl font-semibold text-white py-2 px-4 rounded-full flex items-center justify-center gap-2"
      >
        Add To Cart
        <img className="h-[28px]" src={images.addtoCart} alt="" />
      </button>
    </div>
  );
};

export default BookCard;
