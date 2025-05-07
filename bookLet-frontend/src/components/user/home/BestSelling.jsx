import React, { useContext } from 'react';
import { Heart } from 'lucide-react';
import { AppContext } from '../../../context/AppContext';
import DealCard from './DealCard';
import BookCard from './BookCard';

const BestSelling = () => {
      const { allBooks } = useContext(AppContext) || { allBooks: [] };
    

  // Categories
  const categories = [
    "Historical Biographies",
    "Leaders & Notable",
    "Modern Biographies",
    "Sports Biographies",
    "United States Biographies",
    "Action & Adventure"
  ];

  return allBooks? (
    <div className="bg-gray-100 p-6 rounded-3xl max-w-6xl mx-auto my-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Best Selling Books</h1>
        <div className="flex space-x-2">
          <button className="rounded-full bg-white p-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <button className="rounded-full bg-web-primary p-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar categories */}
        <div className="bg-white rounded-xl p-6 w-full md:w-64 h-fit">
          <div className="space-y-2">
            {categories.map((category, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg ${
                  index === 1 ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'
                } flex justify-between items-center cursor-pointer`}
              >
                <span>{category}</span>
                {index === 1 && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            {/* <button className="text-gray-600 flex items-center">
              View More
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 ml-1">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button> */}
          </div>
        </div>

        {/* Book cards */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {allBooks.slice(0, 3).map((book) => (
          <BookCard key={book.bookId} book={book} />
        ))}
        </div>
      </div>
    </div>
  ):(
    <div className="bg-gray-100 p-6 rounded-3xl max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Best Selling Books</h1>
      </div>
      <p className="text-gray-500">Loading...</p>
    </div>
  );
};

export default BestSelling;