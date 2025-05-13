import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BookSummary from "../../components/user/book details/BookSummary";
import BookToCart from "../../components/user/book details/BookToCart";
import RatingReview from "../../components/user/book details/RatingReview";
import apiClient from "../../api/axios";
import BookCard from "../../components/user/home/BookCard";
import AddReviewForm from "../../components/user/book details/AddReviewForm";
import { toast } from "react-toastify";

const BookDetails = () => {
  const { state } = useLocation();
  const bookDetail = state?.book || {};
  const token = localStorage.getItem("token");
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);

  const onAddReview = async ({ rating, review }) => {
    try {
      const payload = {
        bookId: bookDetail.bookId,
        Stars: rating,
        Comment: review,
      };

      console.log(payload);

      const { data } = await apiClient.post("/review/addReview", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.statusCode === 200) {
        toast.success("Review submitted successfully!");
        setReviews((prev) => [data.data, ...prev]); // Update UI without refetch
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    }
  };

  const fetchReview = async () => {
    try {
      const { data } = await apiClient.get(
        `/review/getReviews/${bookDetail.bookId}`
      );
      console.log(data);
      if (data) {
        setReviews(data);
      }
      if (!data) {
        setReviews([]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchSimilarBooks = async () => {
    try {
      const { data } = await apiClient.get(
        `/book/bookByAuthor/${bookDetail.author}`
      );

      console.log(data);

      if (!data) {
        setSimilar([]);
      } else {
        setSimilar(data);
      }
      console.log("similar", similar);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchReview();
    fetchSimilarBooks();
  }, []);

  return (
    <div className="px-32 bg-web-background">
      {/* Breadcrumb */}
      <div className="text-sm mb-8">Home/Books/{bookDetail.title}</div>

      {/* Main content */}
      <div className="flex flex-row justify-between gap-10 mb-8">
        <BookSummary book={bookDetail} />
        <BookToCart book={bookDetail} />
      </div>

      {/* Reviews section */}
      <div className="mb-8">
        <h1 className="font-semibold text-2xl mb-4">Rating and Reviews</h1>
        <div className="flex flex-col">
          <div>
            {reviews.length === 0 ? (
              <p>No reviews found.</p>
            ) : (
              reviews
                .slice(0, 5)
                .map((review) => (
                  <RatingReview key={review.reviewId} review={review} />
                ))
            )}
          </div>
          <AddReviewForm onSubmit={onAddReview} />
        </div>
      </div>

      {/* More by author section */}
      <div className="mb-8">
        <h1 className="font-semibold text-2xl mb-4">Similar Books by Author</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mt-5">
          {similar.length === 0 ? (
            <p>No similar books found.</p>
          ) : (
            similar
              .slice(0, 5)
              .map((book) => <BookCard key={book.bookId} book={book} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
