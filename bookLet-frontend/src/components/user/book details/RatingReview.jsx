import React, { useState } from "react";
import images from "../../../assets/assets";

// Star rating display component
const StarRating = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  // Generate full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <svg key={`star-${i}`} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  
  // Add half star if needed
  if (hasHalfStar) {
    stars.push(
      <svg key="half-star" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <defs>
          <linearGradient id="halfGradient">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#D1D5DB" />
          </linearGradient>
        </defs>
        <path fill="url(#halfGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  
  // Add empty stars
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <svg key={`empty-star-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  
  return (
    <div className="flex items-center">
      <div className="flex">{stars}</div>
      <span className="ml-2 text-gray-600">({rating})</span>
    </div>
  );
};

// Review submission form component
const AddReviewForm = ({ onSubmit }) => {
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    if (newReview.trim() === "") {
      alert("Please enter a review");
      return;
    }
    onSubmit({ rating, review: newReview });
    setNewReview("");
    setRating(0);
  };

  const renderRatingInput = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          className="focus:outline-none"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
        >
          <svg 
            className={`w-8 h-8 ${
              i <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"
            }`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Add Your Review</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex">{renderRatingInput()}</div>
        </div>
        <div className="mb-4">
          <label htmlFor="review" className="block text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="review"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Share your thoughts about this book..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

// Main RatingReview component
const RatingReview = ({ review, onAddReview }) => {
  return (
    <div className="mb-8">
      {/* Existing review display */}
      {review && (
        <div className="flex flex-row gap-4 w-full max-w-4xl border p-4 rounded-lg mb-6">
          <img 
            className="h-28 w-28 rounded-full object-cover" 
            src={images.book1} 
            alt={`${review.user.username}'s profile`} 
          />
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{review.user.username}</h1>
            <div className="my-2">
              <StarRating rating={review.rating} />
            </div>
            <p className="mt-2 text-gray-700">{review.review}</p>
          </div>
        </div>
      )}

      {/* Review submission form */}
      <AddReviewForm onSubmit={onAddReview} />
    </div>
  );
};

export default RatingReview;