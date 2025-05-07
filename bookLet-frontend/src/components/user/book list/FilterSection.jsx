import React, { useState } from "react";
import { ChevronDown, ChevronUp, X, Star, Check } from "lucide-react";

const genres = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Biography",
  "Fantasy",
  "Mystery",
  "Romance",
  "Horror",
];

const FilteringSection = ({
  selectedGenres,
  setSelectedGenres,
  selectedSort,
  setSelectedSort,
  selectedRatings,
  setSelectedRatings,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    genres: true,
    sort: true,
    ratings: true,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleGenreChange = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleRatingChange = (rating) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating));
    } else {
      setSelectedRatings([...selectedRatings, rating]);
    }
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedRatings([]);
    setSelectedSort("");
  };

  const totalFiltersApplied = selectedGenres.length + selectedRatings.length + (selectedSort ? 1 : 0);

  // Sort options
  const sortOptions = [
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "rating-high-low", label: "Rating: High to Low" },
    { value: "newest", label: "Newest Arrivals" },
    { value: "bestselling", label: "Bestselling" },
  ];

  return (
    <div className="bg-web-background rounded-lg shadow-md p-4 w-full max-w-xs h-[750px]">
      {/* Header with filter count */}
      <div className="flex justify-between items-center mb-4 border-b pb-3">
        <h2 className="text-lg font-bold">Filters</h2>
        {totalFiltersApplied > 0 && (
          <div className="flex items-center">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
              {totalFiltersApplied}
            </span>
            <button 
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
            >
              Clear All <X size={14} className="ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Genre Section */}
      <div className="mb-4 border-b pb-4">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2" 
          onClick={() => toggleSection("genres")}
        >
          <h3 className="font-semibold">Genre</h3>
          {expandedSections.genres ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {expandedSections.genres && (
          <div className="space-y-2 mt-3">
            {genres.map((genre) => (
              <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedGenres.includes(genre) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                  {selectedGenres.includes(genre) && <Check size={12} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                />
                <span className="text-sm">{genre}</span>
                {/* Optional: Show count of books in this genre */}
                {/* <span className="text-xs text-gray-500 ml-auto">(42)</span> */}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sort By Section */}
      <div className="mb-4 border-b pb-4">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection("sort")}
        >
          <h3 className="font-semibold">Sort By</h3>
          {expandedSections.sort ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {expandedSections.sort && (
          <div className="mt-3">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Recommended</option>
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Ratings Section */}
      <div className="mb-4">
        <div 
          className="flex justify-between items-center cursor-pointer mb-2"
          onClick={() => toggleSection("ratings")}
        >
          <h3 className="font-semibold">Ratings</h3>
          {expandedSections.ratings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
        
        {expandedSections.ratings && (
          <div className="space-y-3 mt-3">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center cursor-pointer">
                <div className={`w-4 h-4 border rounded flex items-center justify-center ${selectedRatings.includes(rating) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                  {selectedRatings.includes(rating) && <Check size={12} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedRatings.includes(rating)}
                  onChange={() => handleRatingChange(rating)}
                />
                <div className="flex items-center ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                  <span className="text-sm ml-1">& Up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Applied Filters Summary - Optional */}
      {totalFiltersApplied > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h3 className="font-semibold text-sm mb-2">Applied Filters</h3>
          <div className="flex flex-wrap gap-2">
            {selectedGenres.map(genre => (
              <div key={genre} className="bg-gray-100 text-xs rounded-full px-3 py-1 flex items-center">
                {genre}
                <button onClick={() => handleGenreChange(genre)} className="ml-1">
                  <X size={12} />
                </button>
              </div>
            ))}
            {selectedRatings.map(rating => (
              <div key={rating} className="bg-gray-100 text-xs rounded-full px-3 py-1 flex items-center">
                {rating}★ & Up
                <button onClick={() => handleRatingChange(rating)} className="ml-1">
                  <X size={12} />
                </button>
              </div>
            ))}
            {selectedSort && (
              <div className="bg-gray-100 text-xs rounded-full px-3 py-1 flex items-center">
                {sortOptions.find(opt => opt.value === selectedSort)?.label || selectedSort}
                <button onClick={() => setSelectedSort("")} className="ml-1">
                  <X size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilteringSection;