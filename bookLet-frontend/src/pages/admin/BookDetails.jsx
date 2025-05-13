import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import { Timer } from "lucide-react";
import DealsDiscount from "../../components/admin/add discount/DealsDiscount";

const BookDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDiscount, setShowDiscount] = useState(false); // State for displaying the discount form
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await apiClient.get(`/bookcrud/getbookbyid/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBook(res.data.data);
        setError(null);
        setLoading(false);

        // Call review fetch after book is set
        fetchReview(res.data.data.bookId);
      } catch (err) {
        console.error("Failed to fetch book details:", err);
        setError("Failed to load book details. Please try again later.");
        setLoading(false);
      }
    };

    if (bookId) {
      fetchBookDetails();
    }
  }, [bookId]);

  const fetchReview = async (id) => {
    try {
      const { data } = await apiClient.get(`/review/getReviews/${id}`);
      setReviews(data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/bookcrud/deletebook/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/admin/books");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // Toggle showDiscount state
  const toggleDiscount = () => {
    setShowDiscount(!showDiscount); // Toggle the discount view
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate("/admin/books")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Back to Books
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-xl mb-4">Book not found</div>
        <button
          onClick={() => navigate("/admin/books")}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3 lg:w-1/4">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full object-cover"
                />
              </div>

              <div className="md:w-2/3 lg:w-3/4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {book.title}
                </h1>
                <p className="text-gray-600 mb-4">
                  by{" "}
                  <span className="font-medium text-indigo-600">
                    {book.author}
                  </span>
                </p>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={toggleDiscount} // This will toggle the discount form
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center"
                  >
                    <Timer className="mr-2" />
                    Add Timed Discount
                  </button>
                  <button
                    onClick={() => navigate(`/admin/books/edit/${book.bookId}`)}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conditionally render the DealsDiscount component */}
        {showDiscount && <DealsDiscount bookId={bookId} />}

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Deletion
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this book? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;