import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/axios";
import Swal from 'sweetalert2';

const BookDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountData, setDiscountData] = useState({
    discount: 0,
    startTime: '',
    endTime: '',
    isOnSale: false
  });
  const navigate = useNavigate();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await apiClient.delete(`/bookcrud/deletebook/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        await Swal.fire(
          'Deleted!',
          'Book has been deleted.',
          'success'
        );
        
        navigate('/admin/books');
      } catch (err) {
        console.error("Failed to delete book:", err);
        Swal.fire(
          'Error!',
          'Failed to delete book. Please try again later.',
          'error'
        );
      }
    }
  };

  const handleAddDiscount = async () => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.put(`/bookcrud/discountOffer/${bookId}`, discountData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await Swal.fire({
        title: 'Success!',
        text: 'Discount has been added successfully',
        icon: 'success',
        confirmButtonColor: '#3085d6',
      });

      const res = await apiClient.get(`/bookcrud/getbookbyid/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBook(res.data.data);
      setShowDiscountModal(false);
    } catch (err) {
      console.error("Failed to add discount:", err);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add discount. Please try again later.',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      });
    }
  };

  const openDiscountModal = () => {
    setShowDiscountModal(true);
  };

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

  // Generate rating stars
  const renderRatingStars = (rating = 4.5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#F1F2EE]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#435058]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F1F2EE]">
        <div className="text-[#F97300] text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate("/admin/books")}
          className="bg-[#435058] text-white px-4 py-2 rounded"
        >
          Back to Books
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F1F2EE]">
        <div className="text-xl mb-4">Book not found</div>
        <button
          onClick={() => navigate("/admin/books")}
          className="bg-[#435058] text-white px-4 py-2 rounded"
        >
          Back to Books
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F2EE]">

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/admin/books')}
          className="flex items-center gap-2 text-[#435058] hover:text-[#DCF763] transition-colors mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </button>
      </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left Column - Book Cover */}
              <div className="md:w-1/3 lg:w-1/4">
                <div className="relative">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full rounded-md shadow-md"
                  />
                </div>
              </div>

              {/* Right Column - Book Info */}
              <div className="md:w-2/3 lg:w-3/4">
                <h1 className="text-2xl font-bold text-[#435058] mb-1">{book.title}</h1>
                <p className="text-gray-600 text-sm mb-3">by {book.author}</p>

                <div className="mb-4">
                  <h2 className="text-sm font-medium text-[#435058] mb-2">Synopsis</h2>
                  <p className="text-gray-700 text-sm leading-relaxed">{book.description}</p>
                </div>


                {/* Price */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Rs.</p>
                  <p className="text-2xl font-bold text-[#435058]">{book.price}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">Quantity</p>
                  <p className="text-lg font-medium text-[#435058]">{book.quantity}</p>
                </div>

                {/* Book Info */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="text-sm mb-4 font-medium">Other info</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-xs text-gray-500">Book Pages</p>
                      <p className="text-sm font-medium">{book.pageCount} Pages</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <p className="text-xs text-gray-500">Format</p>
                      <p className="text-sm font-medium">{book.format}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <p className="text-xs text-gray-500">ISBN</p>
                      <p className="text-sm font-medium">{book.isbn}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                      <p className="text-xs text-gray-500">Language</p>
                      <p className="text-sm font-medium">{book.language}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => navigate(`/admin/books/edit/${book.bookId}`)}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={openDiscountModal}
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add Discount
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings and Reviews */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6 p-6">
          <h2 className="text-lg font-bold text-[#435058] mb-4">Rating and Reviews</h2>
          
          {/* Review Item */}
          <div className="mb-6 border-b pb-4">
            <div className="flex items-start mb-1">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                <img src="/api/placeholder/40/40" alt="Reviewer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm">Samiksha Rai</h3>
                </div>
                <div className="flex items-center my-1">
                  {renderRatingStars(5)}
                  <span className="ml-1 text-xs text-gray-500">(4)</span>
                </div>
                <p className="text-sm text-gray-700">
                  Olive Smith doesn't believe in lasting romantic relationships, but her best friend does, and that's what got her into this situation.
                </p>
              </div>
            </div>
          </div>

          {/* Review Item */}
          <div className="mb-6">
            <div className="flex items-start mb-1">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                <img src="/api/placeholder/40/40" alt="Reviewer" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-sm">Samiksha Rai</h3>
                </div>
                <div className="flex items-center my-1">
                  {renderRatingStars(5)}
                  <span className="ml-1 text-xs text-gray-500">(4)</span>
                </div>
                <p className="text-sm text-gray-700">
                  Olive Smith doesn't believe in lasting romantic relationships, but her best friend does, and that's what got her into this situation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDiscountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
            <h2 className="text-2xl font-bold text-[#435058] mb-2 flex items-center gap-2">
              
              Add Discount
            </h2>
            <div className="space-y-5">
              {/* Discount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Percentage</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountData.discount}
                    onChange={e => setDiscountData({ ...discountData, discount: parseInt(e.target.value) || 0 })}
                    className="block w-full rounded-md border-gray-300 pr-10 focus:border-[#DCF763] focus:ring-[#DCF763] text-lg"
                    placeholder="e.g. 20"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-bold">%</span>
                </div>
              </div>
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={discountData.startTime}
                  onChange={e => setDiscountData({ ...discountData, startTime: e.target.value })}
                  className="block w-full rounded-md border-gray-300 focus:border-[#DCF763] focus:ring-[#DCF763]"
                />
              </div>
              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={discountData.endTime}
                  onChange={e => setDiscountData({ ...discountData, endTime: e.target.value })}
                  className="block w-full rounded-md border-gray-300 focus:border-[#DCF763] focus:ring-[#DCF763]"
                />
              </div>
              {/* On Sale Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">Set as On Sale</span>
                <button
                  type="button"
                  onClick={() => setDiscountData({ ...discountData, isOnSale: !discountData.isOnSale })}
                  className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${discountData.isOnSale ? 'bg-[#DCF763]' : 'bg-gray-300'}`}
                >
                  <span
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${discountData.isOnSale ? 'translate-x-4' : ''}`}
                  />
                </button>
                <span className={`text-xs font-semibold ${discountData.isOnSale ? 'text-[#435058]' : 'text-gray-400'}`}>
                  {discountData.isOnSale ? 'Yes' : 'No'}
                </span>
              </div>
              {/* Error message placeholder */}
              {/* {error && <div className="text-red-500 text-sm">{error}</div>} */}
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setShowDiscountModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDiscount}
                className="px-5 py-2 text-sm font-bold text-white bg-[#435058] hover:bg-[#2d353a] rounded-md shadow"
              >
                Add Discount
              </button>
            </div>
          </div>
          {/* Optional: Add fade-in animation */}
          <style>
            {`
              .animate-fade-in {
                animation: fadeIn 0.25s ease;
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px);}
                to { opacity: 1; transform: translateY(0);}
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
};

export default BookDetail;