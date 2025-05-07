import React, { useContext, useEffect, useState } from "react";
import Loading from "../../basic components/Loading";
import { AppContext } from "../../../context/AppContext";
import DealCard from "./DealCard";

const DealSection = () => {
  const { allBooks } = useContext(AppContext) || { allBooks: [] };

  return allBooks ? (
    <div className="mb-10">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-bold text-2xl mb-4">Deal Of the Day</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {allBooks.slice(0, 3).map((book) => (
          <DealCard key={book.bookId} book={book} />
        ))}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default DealSection;
