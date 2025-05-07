using System.Security.Claims;
using BookLibrary.Data;
using BookLibrary.DTOs.Request;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/review")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        public readonly AuthDbContext _context;
        public ReviewController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet("getReviews/{bookId}")]
        public async Task<ActionResult> GetReviews(Guid bookId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.BookId == bookId)
                .Include(r => r.User)
                .Select(r => new ReviewDTO
                {
                    ReviewId = r.ReviewId,
                    Comment = r.Comment,
                    Stars = r.Stars,
                    Username = r.User.Username,
                })
                .ToListAsync();

            if (reviews == null || reviews.Count == 0)
            {
                return NotFound(new
                {
                    StatusCode = 400,
                    message = "No reviews found for this book."
                });
            }

            return Ok(reviews);
        }



        [HttpPost("addReview")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<ActionResult> AddReview(ReviewDTO review)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var book = await _context.Books.FindAsync(review.BookId);
            if (book == null)
                return NotFound("Book not found");

            //checking purchase
            var checkPurchase = await _context.Orders.Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.UserId == userId && o.OrderItems.Any(oi => oi.BookId == review.BookId) && o.Status == "Completed");

            if (checkPurchase == null)
                return BadRequest(new
                {
                    StatusCode = 400,
                    Message = "You must purchase the book before reviewing it."

                });

            var newReview = new Rating
            {
                ReviewId = Guid.NewGuid(),
                BookId = review.BookId,
                UserId = userId,
                Stars = review.Stars,
                Comment = review.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(newReview);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                StatusCode = 200,
                Message = "Review added Successfully;"
            }
            );
        }

        [HttpDelete("deleteReview/{reviewId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<ActionResult> DeleteReview(Guid reviewId)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
                return NotFound("Review not found");

            if (review.UserId != userId)
                return Forbid("You are not authorized to delete this review.");

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                StatusCode = 200,
                Message = "Review deleted successfully."
            });
        }
    }
}
