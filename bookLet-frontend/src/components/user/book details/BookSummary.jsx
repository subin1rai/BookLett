import React from "react";
import { Barcode, Globe } from "lucide-react";

const BookSummary = ({book}) => {
  return (
    <div className="flex flex-row justify-between gap-8">
      <img className="h-[450px] w-[300px] rounded-xl" src={book.imageUrl} alt={book.title} />
      <div>
      <h1 className="text-3xl font-semibold font-sans">{book.title.toUpperCase()}</h1>
        <h2 className="text-xl">by {book.author}</h2>
        <h3 className="mt-3 font-bold text-lg mb-5">Synopsis</h3>
        <p className="text-justify w-[930px]">
          {book.description}
        </p>
        <p className="text-lg mt-6 font-semibold">Other Info</p>
        <div className="flex flex-row gap-4 mt-2">
          <div className="flex flex-col items-center border rounded-md py-2 px-4 gap-1">
            <p className="text-sm text-gray-400 font-semibold">ISBN</p>
            <Barcode className="h-4" />
            <p className="font-semibold text-sm ">{book.isbn}</p>
          </div>
          <div>
          <div className="flex flex-col items-center border rounded-md w-28 p-2 gap-1">
            <p className="text-sm text-gray-400 font-semibold">Language</p>
            <Globe className="h-4" />
            <p className="font-semibold text-sm ">{book.language}</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSummary;
