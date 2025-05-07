import React, { useContext, useEffect, useState } from "react";
import BookCard from "./BookCard";
import apiClient from "../../../api/axios";
import Loading from "../../basic components/Loading";
import { ArrowBigLeft, ArrowLeft, ArrowRight } from "lucide-react";
import { AppContext } from "../../../context/AppContext";

const BookSection = () => {
  const { allBooks } = useContext(AppContext) || { allBooks: [] };

  return allBooks ? (
    <div className="mb-10">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-bold text-2xl mb-4">New Arrivals</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-5">
        {allBooks.slice(0, 5).map((book) => (
          <BookCard key={book.bookId} book={book} />
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default BookSection;
