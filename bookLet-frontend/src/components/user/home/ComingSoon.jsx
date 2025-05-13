import React, { useContext, useEffect, useState } from "react";
import BookCard from "./BookCard";
import apiClient from "../../../api/axios";
import Loading from "../../basic components/Loading";
import { ArrowBigLeft, ArrowLeft, ArrowRight } from "lucide-react";
import { AppContext } from "../../../context/AppContext";

const ComingSoon = () => {
  const { comingSoon } = useContext(AppContext) || { comingSoon: [] };

  return comingSoon ? (
    <div className="mb-10">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-bold text-2xl mb-4">Coming Soon</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-5">
        {comingSoon.slice(0, 5).map((book) => (
          <BookCard key={book.bookId} book={book} show={false} isSoon={true} />
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default ComingSoon;
