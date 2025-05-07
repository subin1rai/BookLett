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

    }
}
