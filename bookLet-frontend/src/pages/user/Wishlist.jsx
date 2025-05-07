import React, { useContext, useEffect, useState } from "react";
import apiClient from "../../api/axios";
import Loading from "../../components/basic components/Loading";
import BookCard from "../../components/user/home/BookCard";
import { AppContext } from "../../context/AppContext";

const Wishlist = () => {
  const { fetchWishlist, wishlist } = useContext(AppContext);
useEffect(()=> {
    fetchWishlist();
},[])
  return wishlist ? (
    <div className="px-24 bg-web-background">
      <h1 className="font-semibold text-3xl py-4 ">Your Wishlist</h1>

      <div className="flex flex-wrap justify-start gap-6">
        {wishlist.map((book) => (
          <BookCard key={book.bookId} book={book} />
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Wishlist;
