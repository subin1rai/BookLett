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
        public async Task<ActionResult> GetAllBooks(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] string? genre = null,
            [FromQuery] string? author = null,
            [FromQuery] string? sortBy = "title",
            [FromQuery] bool sortDesc = false)
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

            // Include ratings and users
            var query = _context.Books
                .Include(b => b.Reviews)
                    .ThenInclude(r => r.User) // Ensure User nav is present in Rating
                .AsQueryable();

            // Filtering
            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(b =>
                    b.Title.ToLower().Contains(search.ToLower()) ||
                    b.Author.ToLower().Contains(search.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(genre))
            {
                query = query.Where(b => b.Genre.ToLower() == genre.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(author))
            {
                query = query.Where(b => b.Author.ToLower() == author.ToLower());
            }

            // Sorting
            query = sortBy.ToLower() switch
            {
                "price" => sortDesc ? query.OrderByDescending(b => b.Price) : query.OrderBy(b => b.Price),
                "createdat" => sortDesc ? query.OrderByDescending(b => b.CreatedAt) : query.OrderBy(b => b.CreatedAt),
                _ => sortDesc ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title)
            };

            var totalBooks = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalBooks / (double)pageSize);

            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var bookDtos = books.Select(b => new
            {
                b.BookId,
                b.Title,
                b.Author,
                b.Genre,
                b.ISBN,
                b.Description,
                b.Publisher,
                b.PublicationDate,
                b.Price,
                b.Quantity,
                b.Language,
                b.Discount,
                b.Format,
                b.ImageUrl,
                b.AvailableInLibrary,
                b.IsOnSale,
                b.StartTime,
                b.EndTime,
                b.CreatedAt,

                // ⭐ Average Stars
                AverageStars = b.Reviews != null && b.Reviews.Any()
                    ? Math.Round(b.Reviews.Average(r => r.Stars), 1)
                    : 0,

                // 💬 All Comments + Reviews
                Reviews = b.Reviews?.Select(r => new ReviewDTO
                {
                    ReviewId = r.ReviewId,
                    BookId = r.BookId,
                    UserId = r.UserId,
                    Username = r.User != null ? r.User.Username : "Anonymous",
                    Stars = r.Stars,
                    Comment = r.Comment
                }).ToList() ?? new List<ReviewDTO>()
            });

            return Ok(new
            {
                status = "success",
                code = 200,
                message = "Books retrieved successfully",
                pagination = new
                {
                    currentPage = page,
                    pageSize = pageSize,
                    totalPages,
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
    // Find the user claim
    var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    // If no user claim is found, return Unauthorized response
    if (userClaim == null)
        return Unauthorized("Invalid! Token is missing");

    // Get the user ID from the claim
    var userId = Guid.Parse(userClaim.Value);

    // Find the wishlist entry that matches the user and book
    var wishlist = await _context.Whitelists
        .FirstOrDefaultAsync(w => w.UserId == userId && w.BookId == bookId);

    // If the wishlist entry is not found, return a response indicating the book is not in the wishlist
    if (wishlist == null)
    {
        return Ok(new
        {
            status = false,
            code = 200,
            message = "Book is not in the wishlist"
        });
    }

    // Remove the item from the wishlist
    _context.Whitelists.Remove(wishlist);
    await _context.SaveChangesAsync();

    // Return success message after removing the book
    return Ok(new
    {
        status = true,
        statusCode = 200,
        message = "Book removed from wishlist successfully"
    });
}

        [HttpGet("bookByAuthor/{name}")]
        public async Task<ActionResult<IEnumerable<BookDTO>>> GetBooksByAuthor(string name)
        {
            var books = await _context.Books
                .Where(b => b.Author.Contains(name))
                .ToListAsync();

            if (books == null || books.Count == 0)
            {
                return NotFound("No books found for the given author.");
            }

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
                IsOnSale = b.IsOnSale
            }).ToList();

            return Ok(bookDtos);
        }

        [HttpGet("bestSeller")]
        public async Task<IActionResult> GetBestSellers()
        {
            var bestSellingBooks = await _context.OrderItems
                .GroupBy(oi => oi.BookId)
                .Select(group => new
                {
                    BookId = group.Key,
                    OrderCount = group.Count()
                })
                .OrderByDescending(g => g.OrderCount)
                .Take(10) // Top 10 bestsellers, you can adjust this
                .ToListAsync();

            var bookIds = bestSellingBooks.Select(b => b.BookId).ToList();

            var books = await _context.Books
                .Where(b => bookIds.Contains(b.BookId))
                .ToListAsync();

            var result = bestSellingBooks
                .Join(books, b => b.BookId, book => book.BookId, (b, book) => new
                {
                    book = new BookDTO
                    {
                        BookId = book.BookId,
                        Title = book.Title,
                        Author = book.Author,
                        Genre = book.Genre,
                        ISBN = book.ISBN,
                        Description = book.Description,
                        Publisher = book.Publisher,
                        PublicationDate = book.PublicationDate,
                        Price = book.Price,
                        Quantity = book.Quantity,
                        Language = book.Language,
                        Discount = book.Discount,
                        Format = book.Format,
                        ImageUrl = book.ImageUrl,
                        AvailableInLibrary = book.AvailableInLibrary,
                        IsOnSale = book.IsOnSale
                    },
                    orderCount = b.OrderCount
                })
                .OrderByDescending(x => x.orderCount)
                .ToList();

            return Ok(new
            {
                status = "success",
                code = 200,
                message = "Top selling books fetched successfully",
                data = result
            });
        }

        [HttpGet("search")]
        public async Task<ActionResult> SearchBooks(
            [FromQuery] string? searchTerm = null,
            [FromQuery] string? genre = null,
            [FromQuery] string? author = null,
            [FromQuery] string? publisher = null,
            [FromQuery] string? language = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] bool? availableInLibrary = null,
            [FromQuery] bool? isOnSale = null,
            [FromQuery] string? sortBy = "title",
            [FromQuery] bool sortDesc = false,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
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

            // Include ratings and users
            var query = _context.Books
                .Include(b => b.Reviews)
                    .ThenInclude(r => r.User)
                .AsQueryable();

            // Apply search filters
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(b =>
                    b.Title.ToLower().Contains(searchTerm.ToLower()) ||
                    b.Author.ToLower().Contains(searchTerm.ToLower()) ||
                    b.Description.ToLower().Contains(searchTerm.ToLower()) ||
                    b.ISBN.ToLower().Contains(searchTerm.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(genre))
            {
                query = query.Where(b => b.Genre.ToLower() == genre.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(author))
            {
                query = query.Where(b => b.Author.ToLower().Contains(author.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(publisher))
            {
                query = query.Where(b => b.Publisher.ToLower().Contains(publisher.ToLower()));
            }

            if (!string.IsNullOrWhiteSpace(language))
            {
                query = query.Where(b => b.Language.ToLower() == language.ToLower());
            }

            if (minPrice.HasValue)
            {
                query = query.Where(b => b.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(b => b.Price <= maxPrice.Value);
            }

            if (availableInLibrary.HasValue)
            {
                query = query.Where(b => b.AvailableInLibrary == availableInLibrary.Value);
            }

            if (isOnSale.HasValue)
            {
                query = query.Where(b => b.IsOnSale == isOnSale.Value);
            }

            // Apply sorting
            query = sortBy.ToLower() switch
            {
                "price" => sortDesc ? query.OrderByDescending(b => b.Price) : query.OrderBy(b => b.Price),
                "createdat" => sortDesc ? query.OrderByDescending(b => b.CreatedAt) : query.OrderBy(b => b.CreatedAt),
                "title" => sortDesc ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title),
                "author" => sortDesc ? query.OrderByDescending(b => b.Author) : query.OrderBy(b => b.Author),
                "genre" => sortDesc ? query.OrderByDescending(b => b.Genre) : query.OrderBy(b => b.Genre),
                _ => sortDesc ? query.OrderByDescending(b => b.Title) : query.OrderBy(b => b.Title)
            };

            var totalBooks = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalBooks / (double)pageSize);

            var books = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var bookDtos = books.Select(b => new
            {
                b.BookId,
                b.Title,
                b.Author,
                b.Genre,
                b.ISBN,
                b.Description,
                b.Publisher,
                b.PublicationDate,
                b.Price,
                b.Quantity,
                b.Language,
                b.Discount,
                b.Format,
                b.ImageUrl,
                b.AvailableInLibrary,
                b.IsOnSale,
                b.StartTime,
                b.EndTime,
                b.CreatedAt,
                AverageStars = b.Reviews != null && b.Reviews.Any()
                    ? Math.Round(b.Reviews.Average(r => r.Stars), 1)
                    : 0,
                Reviews = b.Reviews?.Select(r => new ReviewDTO
                {
                    ReviewId = r.ReviewId,
                    BookId = r.BookId,
                    UserId = r.UserId,
                    Username = r.User != null ? r.User.Username : "Anonymous",
                    Stars = r.Stars,
                    Comment = r.Comment
                }).ToList() ?? new List<ReviewDTO>()
            });

            return Ok(new
            {
                status = "success",
                code = 200,
                message = "Books retrieved successfully",
                pagination = new
                {
                    currentPage = page,
                    pageSize = pageSize,
                    totalPages,
                    totalItems = totalBooks
                },
                data = bookDtos
            });
        }

    }
}
