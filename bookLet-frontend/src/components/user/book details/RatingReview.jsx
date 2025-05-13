import React from "react";
import images from "../../../assets/assets";
import StarRating from "./StarRating";
import AddReviewForm from "./AddReviewForm";

const RatingReview = ({ review }) => {
  const initial = review?.username?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="mb-8">
      {review && (
        <div className="flex flex-row gap-4 w-full max-w-4xl p-4 rounded-lg mb-6">
          {/* User Initial Avatar */}
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold text-lg">
            {initial}
          </div>

          {/* Review Content */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold">{review.username}</h1>
            <div className="my-2">
              <StarRating rating={review.stars} />
            </div>
            <p className="mt-2 text-gray-700">{review.comment}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RatingReview;
