import React, { useState, useEffect } from "react";
import FilteringSection from "../../components/user/book list/FilterSection";
import Loading from "../../components/basic components/Loading";
import BookCard from "../../components/user/home/BookCard";
import apiClient from "../../api/axios";

const BookList = () => {
  const [selectedGenres, setSelectedGenres] = useState("");
  const [selectedSort, setSelectedSort] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const { data } = await apiClient.get(
        `/book/all?page=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAllBooks(data.data); // books array
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalItems || 0);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  return loading ? (
    <Loading />
  ) : (
    <div className="px-24 bg-web-background min-h-screen">
      <div className="flex flex-row gap-14 justify-between">
        <FilteringSection
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          selectedRatings={selectedRatings}
          setSelectedRatings={setSelectedRatings}
        />
        <div className="w-full">
          <div className="text-3xl font-bold mb-4">Books</div>
          <p className="text-gray-600 text-sm mb-2">
            Showing page {page} of {totalPages} — Total books: {totalItems}
          </p>
          <hr />
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-7">
            {allBooks.map((book) => (
              <BookCard key={book.bookId} book={book} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-10 space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-lg font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookList;
