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
    }
}