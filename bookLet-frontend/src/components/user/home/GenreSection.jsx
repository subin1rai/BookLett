import React, { useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import genreIcons from "../../basic components/GenreIcons"

const GenreSection = () => {
  const { allBooks } = useContext(AppContext) || { allBooks: [] };

  return (
    <div className="mb-10">
      <h1 className="font-bold text-2xl mb-4">Shop By Genre</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-3 mt-5">
        {Object.entries(
          allBooks.reduce((acc, book) => {
            acc[book.genre] = (acc[book.genre] || 0) + 1;
            return acc;
          }, {})
        )
          .slice(0, 6)
          .map(([genre, count]) => (
            <div className="flex flex-row items-center">
                <img src={genreIcons[genre] || genreIcons["Fiction"]} alt={genre} className="w-12 h-12 object-contain" />
              <div key={genre} className="p-4 text-left">
                <p className="font-semibold text-lg">{genre}</p>
                <p className="text-sm text-gray-500">{count} Items</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GenreSection;
