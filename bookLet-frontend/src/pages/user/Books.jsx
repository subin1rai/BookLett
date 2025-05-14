import React, { useState, useEffect } from "react";
import FilteringSection from "../../components/user/book list/FilterSection";
import Loading from "../../components/basic components/Loading";
import BookCard from "../../components/user/home/BookCard";
import apiClient from "../../api/axios";
import SearchComponent from "../../components/basic components/SearchComponent";

const BookList = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // The backend API treats some sort options as filters, so we need to handle this differently
      // and not chain special filters like awardwinner with other sorts
      let sortBy = selectedSort || "createdat"; // Default to createdAt if nothing is selected
      let sortDesc = true; // Default to descending (newest first)

      // Adjust sortBy to match the backend API expectations
      // The backend handles special cases like "awardwinner" as both filter and sort
      // so we don't need to modify these values

      // Construct query params
      const params = new URLSearchParams({
        page,
        pageSize,
        sortBy,
        sortDesc: sortDesc.toString(),
      });

      // Add genre filter if any genres are selected
      if (selectedGenres.length > 0) {
        params.append("genre", selectedGenres[0]); // Backend only supports one genre at a time
      }

      // Add search query if provided
      if (query) {
        params.append("search", query);
      }

      const { data } = await apiClient.get(`/book/all?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAllBooks(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalItems || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books when page, genre, or sort changes
  useEffect(() => {
    fetchBooks();
  }, [page, selectedGenres, selectedSort]);

  // Handle sort change - need to reset to page 1
  const handleSortChange = (sortValue) => {
    setPage(1); // Reset to first page when changing sort
    setSelectedSort(sortValue);
  };

  // Handle genre change - need to reset to page 1
  const handleGenreChange = (genres) => {
    setPage(1); // Reset to first page when changing genres
    setSelectedGenres(genres);
  };

  // Function to handle search submission
  const handleSearch = () => {
    setPage(1); // Reset to first page when searching
    fetchBooks();
  };

  return (
    <div className="px-24 bg-web-background min-h-screen">
      <div className="flex flex-row gap-14 justify-between">
        <FilteringSection
          selectedGenres={selectedGenres}
          setSelectedGenres={handleGenreChange}
          selectedSort={selectedSort}
          setSelectedSort={handleSortChange}
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
        />
        <div className="w-full">
          <div className="flex flex-row justify-between">
            <div className="text-3xl font-bold mb-4">Books</div>
            <SearchComponent
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              placeholder="Search book by names..."
            />
          </div>
          <p className="text-gray-600 text-sm mb-2">
            Showing page {page} of {totalPages} — Total books: {totalItems}
          </p>
          <hr />

          {/* Book Cards Section with Local Loading State */}
          <div className="relative min-h-[400px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                <Loading />
              </div>
            ) : null}

            <div
              className={`grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-7 ${
                loading ? "opacity-50" : ""
              }`}
            >
              {allBooks.length > 0 ? (
                allBooks.map((book) => (
                  <BookCard key={book.bookId} book={book} show={true} />
                ))
              ) : (
                <div className="col-span-4 text-center py-8 text-gray-500">
                  No books found matching your criteria
                </div>
              )}
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 0 && (
            <div className="flex justify-center items-center mt-10 space-x-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || loading}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-lg font-medium">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages || loading}
                className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookList;
