import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import axios from "axios";

const SearchComponent = ({
  onSearchResults,
  placeholder = "Search books...",
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    genre: "",
    author: "",
    minPrice: "",
    maxPrice: "",
    availableInLibrary: false,
    isOnSale: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        searchTerm,
        page: 1,
        pageSize: 10,
        ...filters,
      });

      // Remove empty filters
      for (const [key, value] of params.entries()) {
        if (!value) params.delete(key);
      }

      const response = await axios.get(`/api/book/search?${params.toString()}`);
      
      if (onSearchResults) {
        onSearchResults(response.data);
      }
    } catch (error) {
      console.error("Search error:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setFilters({
      genre: "",
      author: "",
      minPrice: "",
      maxPrice: "",
      availableInLibrary: false,
      isOnSale: false,
    });
  };

  return (
    <div className={`w-full max-w-4xl ${className}`}>
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full">
        <Search className="text-gray-400 mr-2" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 outline-none bg-transparent text-sm"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="ml-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Genre</label>
              <input
                type="text"
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input
                type="text"
                value={filters.author}
                onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="availableInLibrary"
                checked={filters.availableInLibrary}
                onChange={(e) => setFilters({ ...filters, availableInLibrary: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="availableInLibrary" className="ml-2 block text-sm text-gray-700">
                Available in Library
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isOnSale"
                checked={filters.isOnSale}
                onChange={(e) => setFilters({ ...filters, isOnSale: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isOnSale" className="ml-2 block text-sm text-gray-700">
                On Sale
              </label>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Clear Filters
            </button>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
