import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BookSummary from "../../components/user/book details/BookSummary";
import BookToCart from "../../components/user/book details/BookToCart";
import RatingReview from "../../components/user/book details/RatingReview";
import apiClient from "../../api/axios";
import BookCard from "../../components/user/home/BookCard";

const BookDetails = () => {
  const { state } = useLocation();
  const bookDetail = state?.book || {};
  const token = localStorage.getItem("token");
  const [reviews, setReviews] = useState([]);
  const [similar, setSimilar] = useState([]);

  const fetchReview = async () => {
    try {
      const { data } = await apiClient.get(
        `/review/getReviews/${bookDetail.bookId}`
      );
      console.log(data.data);
      if (data.statusCode == 200) {
        setReviews(data.data);
      }
      if (data.statusCode == 400) {
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
