using System.Security.Claims;
using BookLibrary.Data;
using BookLibrary.DTOs.Request;
using BookLibrary.DTOs.Response;
using BookLibrary.Model;
using BookLibrary.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/bookcrud")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;

        public BookController(AuthDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        [HttpPost("create")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> CreateBook(
            [FromForm] CreateBookDTO createBook,
            IFormFile image,
            [FromServices] CloudinaryService cloudinaryService)
        {
            if (await _context.Books.AnyAsync(b => b.Title == createBook.Title || b.ISBN == createBook.ISBN))
            {
                return BadRequest("Book with same title or ISBN already exists.");
            }

            string imageUrl = null;
            if (image != null)
            {
                imageUrl = await cloudinaryService.UploadImageAsync(image);
            }

            var book = new Book
            {
                BookId = Guid.NewGuid(),
                Title = createBook.Title,
                Author = createBook.Author,
                Genre = createBook.Genre,
                ISBN = createBook.ISBN,
                Description = createBook.Description,
                Publisher = createBook.Publisher,
                PublicationDate = createBook.PublicationDate,
                Price = createBook.Price,
                AwardWinners = createBook.AwardWinners,
                Quantity = createBook.Quantity,
                ImageUrl = imageUrl,
                Language = createBook.Language,
                Discount = createBook.Discount,
                Format = createBook.Format,
                AvailableInLibrary = createBook.AvailableInLibrary,
                IsOnSale = createBook.IsOnSale
            };

            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Admin", $"New book added! {book.Title}");

            return Ok(new
            {
                message = "Book created successfully",
                data = book
            });
        }

        [HttpGet("getallbooks")]
public async Task<ActionResult<IEnumerable<BookDTO>>> GetAllBooks()
{
    var books = await _context.Books
        .OrderByDescending(b => b.PublicationDate)
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
        AwardWinners = b.AwardWinners,
        IsOnSale = b.IsOnSale
    }).ToList();

    return Ok(bookDtos);
}

        [HttpGet("getbookbyid/{id}")]
        [Authorize(Policy = "RequireAdminRole")]

        public async Task<ActionResult<BookDTO>> GetUserById(Guid id)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null) return Unauthorized("Invalid !! Token is missing");

            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("Book not found");
            }
            var bookDto = new BookDTO
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
                Language = book.Language,
                Discount = book.Discount,
                Format = book.Format,
                Quantity = book.Quantity,
                ImageUrl = book.ImageUrl,
                AwardWinners = book.AwardWinners,
                AvailableInLibrary = book.AvailableInLibrary,
                IsOnSale = book.IsOnSale
            };
            return Ok(new
            {
                status = "success",
                message = "Book found",
                data = bookDto
            });
        }

        [HttpPut("updatebook/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> UpdateBook(Guid id, [FromForm] CreateBookDTO updateBook, IFormFile image,
            [FromServices] CloudinaryService cloudinaryService)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("Book not found");
            }

            // Upload the image
            string imageUrl = null;
            if (image != null)
            {
                imageUrl = await cloudinaryService.UploadImageAsync(image);
            }

            book.Title = updateBook.Title ?? book.Title;
            book.Author = updateBook.Author ?? book.Author;
            book.Genre = updateBook.Genre ?? book.Genre;
            book.ISBN = updateBook.ISBN;
            book.Description = updateBook.Description;
            book.Language = updateBook.Language;
            book.Discount = updateBook.Discount;
            book.Format = updateBook.Format;
            book.AwardWinners = updateBook.AwardWinners;
            book.Publisher = updateBook.Publisher;
            book.PublicationDate = updateBook.PublicationDate;
            book.Price = updateBook.Price;
            book.IsOnSale = updateBook.IsOnSale;
            book.AvailableInLibrary = updateBook.AvailableInLibrary;
            book.Quantity = updateBook.Quantity;
            book.ImageUrl = imageUrl ?? book.ImageUrl;

            _context.Books.Update(book);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                message = "Book updated successfully",
                data = book
            });
        }
        [HttpDelete("deletebook/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteBook(Guid id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound("Book not found");
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                message = "Book deleted successfully"
            });
        }

        // timestamp and discount create  
        [HttpPut("discountOffer/{bookid}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult> DiscountOffer(Guid bookid, DiscountDTO discount)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null) return Unauthorized("Invalid !! Token is missing");

            var bookDetails = await _context.Books.FindAsync(bookid);
            if (bookDetails != null)
            {

                bookDetails.Discount = discount.Discount;
                bookDetails.StartTime = discount.StartTime;
                bookDetails.EndTime = discount.EndTime;
                bookDetails.IsOnSale = discount.IsOnSale;
            }

            _context.Books.Update(bookDetails);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                status = "success",
                message = "Discount added successfully"
            });
        }


    }
}
