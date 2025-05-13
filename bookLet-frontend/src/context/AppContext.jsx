import { createContext, useEffect, useState } from "react";
import apiClient from "../api/axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [allBooks, setAllBooks] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const [deals, setDeals] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showVerification, setShowVerification] = useState({
    show: false,
    userId: null,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogged = () => {
    const token = localStorage.getItem("token");
    const isLogged = !!token;
    setIsLoggedIn(isLogged);
    return isLogged;
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;
      const { data } = await apiClient.get("/book/getWishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(data.data);
      setWishlist(data.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const fetchBestSeller = async () => {
    try {
      const { data } = await apiClient.get("/book/bestSeller");
      console.log("bestSeller", data);
      if (data.code == 200) {
        setBestSeller(data.data);
      }
    } catch (error) {
      console.log("Error fetching book");
    }
  };

  const fetchBooks = async () => {
    try {
      const { data } = await apiClient.get("/book/all");
      const sortedBooks = data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const now = new Date();

      const onSaleBooks = sortedBooks.filter((book) => book.isOnSale);
      const upcomingBooks = sortedBooks.filter((book) => !book.isOnSale);

      const deal = onSaleBooks.filter((book) => {
        const start = new Date(book.startTime);
        const end = new Date(book.endTime);
        return book.isOnSale && start <= now && now <= end;
      });

      setAllBooks(onSaleBooks);
      setComingSoon(upcomingBooks);
      setDeals(deal);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addToCart = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const { data: response } = await apiClient.post("/addToCart/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.statusCode == 200) {
        toast.success("Added to Cart");
        getCart();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const updateCartQuantity = (bookId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.bookId === bookId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;
      const { data } = await apiClient.get("/addToCart/getcartitems", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (data.statusCode != 200) {
        console.log("Failed to fetch data");
      }
      console.log(data.data);

      setCart(data.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (checkLogged()) {
      getCart();
      fetchWishlist();
    }
  }, []);

  useEffect(() => {
    fetchBooks();
    fetchBestSeller();
    checkLogged();
  }, []);

  const value = {
    allBooks,
    comingSoon,
    bestSeller,
    deals,
    cart,
    wishlist,
    setWishlist,
    getCart,
    addToCart,
    fetchWishlist,
    updateCartQuantity,
    showSignIn,
    setShowSignIn,
    showSignUp,
    setShowSignUp,
    showVerification,
    setShowVerification,
    isLoggedIn,
    checkLogged,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
