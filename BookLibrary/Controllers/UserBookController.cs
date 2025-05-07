using System.Security.Claims;
using BookLibrary.Data;
using BookLibrary.DTOs.Request;
using BookLibrary.DTOs.Response;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/book")]
    [ApiController]
    public class UserBookController : ControllerBase
    {
        private readonly AuthDbContext _context;
        public UserBookController(AuthDbContext context)
        {
            _context = context;
        }



        //pagination implemented 
        [HttpGet("all")]
        public async Task<ActionResult> GetAllBooks([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page <= 0 || pageSize <= 0)
            {
                return BadRequest(new
                {
                    status = "error",
                    code = 400,
                    message = "Page and pageSize must be greater than 0"
                });
            }

            var totalBooks = await _context.Books.CountAsync();
            var totalPages = (int)Math.Ceiling(totalBooks / (double)pageSize);

            var books = await _context.Books
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var bookDtos = books.Select(b => new BookDTO
            {
                BookId = b.BookId,
                Title = b.Title,
                Author = b.Author,
                Genre = b.Genre,
                ISBN = b.ISBN,
                Description = b.Description,
                Publisher = b.Publisher,
                PublicationDate = b.PublicationDate,
                Price = b.Price,
                Quantity = b.Quantity,
                Language = b.Language,
                Discount = b.Discount,
                Format = b.Format,
                ImageUrl = b.ImageUrl,
                AvailableInLibrary = b.AvailableInLibrary,
                IsOnSale = b.IsOnSale,
                CreatedAt = b.CreatedAt
            }).ToList();

            return Ok(new
            {
                status = "success",
                code = 200,
                message = "Books retrieved successfully",
                pagination = new
                {
                    currentPage = page,
                    pageSize = pageSize,
                    totalPages = totalPages,
                    totalItems = totalBooks
                },
                data = bookDtos
            });
        }

        [HttpPost("addWishlist")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> BookmarkBook(CreateWhitelistDTO dto)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value); // Assuming your UserId is Guid

            var exists = await _context.Whitelists
                .AnyAsync(w => w.UserId == userId && w.BookId == dto.BookId);

            if (exists)
                return BadRequest("Already bookmarked");

            var whitelist = new WhiteList
            {
                UserId = userId,
                BookId = dto.BookId,
                BookmarkedAt = DateTime.UtcNow
            };

            _context.Whitelists.Add(whitelist);
            await _context.SaveChangesAsync();

            return Ok(
                new
                {
                    status = true,
                    statusCode = 200,
                    message = "Bookmarked successfully"
                }
            );
        }


        [HttpGet("getWishlist")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> GetWishlist()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var whitelists = await _context.Whitelists
                .Include(w => w.Book)
                .Where(w => w.UserId == userId)
                .ToListAsync();

            var wishlistDtos = whitelists.Select(w => new BookDTO
            {
                BookId = w.Book.BookId,
                Title = w.Book.Title,
                Author = w.Book.Author,
                Genre = w.Book.Genre,
                ISBN = w.Book.ISBN,
                Description = w.Book.Description,
                Publisher = w.Book.Publisher,
                PublicationDate = w.Book.PublicationDate,
                Price = w.Book.Price,
                Quantity = w.Book.Quantity,
                Language = w.Book.Language,
                Discount = w.Book.Discount,
                Format = w.Book.Format,
                ImageUrl = w.Book.ImageUrl,
                AvailableInLibrary = w.Book.AvailableInLibrary,
                IsOnSale = w.Book.IsOnSale
            }).ToList();

            // var userEntity = whitelists.FirstOrDefault()?.User;
            // var userDto = userEntity == null ? null : new UserDTO
            // {
            //     Id = userEntity.Id,
            //     Username = userEntity.Username,
            //     Email = userEntity.Email,
            //     Role = userEntity.Role
            // };

            return Ok(new
            {
                status = "success",
                code = 200,
                message = "Wishlist retrieved successfully",
                data = wishlistDtos
            });

        }

        [HttpGet("checkWishlist/{bookId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> CheckWishlist(Guid bookId)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var wishlist = await _context.Whitelists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.BookId == bookId);

            if (wishlist == null)
            {
                return Ok(new
                {
                    status = false,
                    code = 200,
                    message = "Book is not in the wishlist"
                });
            }
            else
            {
                return Ok(new
                {
                    status = true,
                    code = 200,
                    message = "Book is in the wishlist"
                });
            }
        }
        [HttpDelete("remove/{bookId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> RemoveWishlist(Guid bookId)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var wishlist = await _context.Whitelists
            .FirstOrDefaultAsync(w => w.UserId == userId && w.BookId == bookId);

            if (wishlist == null)
            {
                return Ok(new
                {
                    status = false,
                    code = 200,
                    message = "Book is not in the wishlist"
                });
            }

            _context.Whitelists.Remove(wishlist);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                status = true,
                statusCode = 200,
                message = "Book removed from wishlist successfully"
            });
        }
    }
}