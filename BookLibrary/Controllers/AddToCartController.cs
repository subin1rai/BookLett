using System.Security.Claims;
using BookLibrary.Data;
using BookLibrary.DTOs.Request;
using BookLibrary.DTOs.Response;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/addToCart")]
    [ApiController]
    public class AddToCartController : ControllerBase
    {
        public readonly AuthDbContext _context;

        public AddToCartController(AuthDbContext context)
        {
            _context = context;
        }
        [HttpPost("add")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<ActionResult<CartItemDTO>> CreateCartItem(CreateCartItemDTO createCartItem)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);
            var book = await _context.Books.FindAsync(createCartItem.BookId);
            if (book == null)
                return NotFound("Book not found");

            if (book.Quantity < createCartItem.Quantity)
                return BadRequest("Not enough quantity available");

            var existingCartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.UserId == userId && c.BookId == createCartItem.BookId);

            if (existingCartItem != null)
            {
                // Update quantity
                existingCartItem.Quantity += createCartItem.Quantity;
                await _context.SaveChangesAsync();

                var updatedBook = await _context.Books.FindAsync(existingCartItem.BookId);
                return Ok(new
                {
                    status = "success",
                    message = "Cart item quantity updated successfully",
                    statusCode = 200,
                    data = new CartItemDTO
                    {
                        CartItemId = existingCartItem.CartItemId,
                        BookId = existingCartItem.BookId,
                        UserId = userId,
                        Quantity = existingCartItem.Quantity,
                        Book = new BookDTO
                        {
                            BookId = updatedBook.BookId,
                            Title = updatedBook.Title,
                            Price = updatedBook.Price,
                            Author = updatedBook.Author,
                            Genre = updatedBook.Genre,
                            ISBN = updatedBook.ISBN,
                            Description = updatedBook.Description,
                            ImageUrl = updatedBook.ImageUrl,
                            AvailableInLibrary = updatedBook.AvailableInLibrary,
                            CreatedAt = updatedBook.CreatedAt,
                            Discount = updatedBook.Discount,
                        }
                    }
                });
            }

            // If not found, add new cart item
            var cartItem = new CartItem
            {
                CartItemId = Guid.NewGuid(),
                BookId = createCartItem.BookId,
                UserId = userId,
                Quantity = createCartItem.Quantity,
                PricePerUnit = book.Price,
            };

            _context.CartItems.Add(cartItem);
            await _context.SaveChangesAsync();

            var cartItemDTO = new CartItemDTO
            {
                CartItemId = cartItem.CartItemId,
                BookId = cartItem.BookId,
                UserId = userId,
                Quantity = cartItem.Quantity,
                Book = new BookDTO
                {
                    BookId = book.BookId,
                    Title = book.Title,
                    Price = book.Price,
                    Author = book.Author,
                    Genre = book.Genre,
                    ISBN = book.ISBN,
                    Description = book.Description,
                    ImageUrl = book.ImageUrl,
                    AvailableInLibrary = book.AvailableInLibrary,
                    CreatedAt = book.CreatedAt,
                    Discount = book.Discount,
                }
            };

            return Ok(new
            {
                status = "success",
                message = "Book added to cart successfully",
                statusCode = 200,
                data = cartItemDTO
            });
        }

        [HttpDelete("remove/{cartItemId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> RemoveCartItem(Guid cartItemId)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.CartItemId == cartItemId && c.UserId == userId);

            if (cartItem == null)
                return NotFound("Cart item not found");

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                message = "Cart item removed successfully",
                statusCode = 200
            });
        }

        [HttpPut("update/{cartItemId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> UpdateCartItem(Guid cartItemId, CreateCartItemDTO updateCartItem)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(c => c.CartItemId == cartItemId && c.UserId == userId);

            if (cartItem == null)
                return NotFound("Cart item not found");

            var book = await _context.Books.FindAsync(cartItem.BookId);
            if (book == null)
                return NotFound("Book not found");

            if (book.Quantity <= updateCartItem.Quantity)
                return BadRequest("Not enough quantity available");

            cartItem.Quantity = updateCartItem.Quantity;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                message = "Cart item updated successfully",
                statusCode = 200,
                data = new CartItemDTO
                {
                    CartItemId = cartItem.CartItemId,
                    BookId = cartItem.BookId,
                    UserId = userId,
                    Quantity = cartItem.Quantity,
                    Book = new BookDTO
                    {
                        BookId = book.BookId,
                        Title = book.Title,
                        Price = book.Price,
                        Author = book.Author,
                        Genre = book.Genre,
                        ISBN = book.ISBN,
                        Description = book.Description,
                        ImageUrl = book.ImageUrl,
                        AvailableInLibrary = book.AvailableInLibrary,
                        CreatedAt = book.CreatedAt,
                        Discount = book.Discount,
                    }
                }
            });
        }

        [HttpGet("getcartitems")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<ActionResult<IEnumerable<CartItemDTO>>> GetCartItems()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var cartItems = await _context.CartItems
                .Where(c => c.UserId == userId)
                .Select(c => new CartItemDTO
                {
                    CartItemId = c.CartItemId,
                    BookId = c.BookId,
                    UserId = c.UserId,
                    Quantity = c.Quantity,
                    Book = new BookDTO
                    {
                        BookId = c.Book.BookId,
                        Title = c.Book.Title,
                        Author = c.Book.Author,
                        Genre = c.Book.Genre,
                        ISBN = c.Book.ISBN,
                        Description = c.Book.Description,
                        Publisher = c.Book.Publisher,
                        PublicationDate = c.Book.PublicationDate,
                        Price = c.Book.Price,
                        Quantity = c.Book.Quantity,
                        Language = c.Book.Language,
                        Discount = c.Book.Discount,
                        Format = c.Book.Format,
                        ImageUrl = c.Book.ImageUrl,
                        AvailableInLibrary = c.Book.AvailableInLibrary,
                        IsOnSale = c.Book.IsOnSale,
                    },
                })
                .ToListAsync();

            return Ok(new
            {
                status = "success",
                message = "Cart items retrieved successfully",
                statusCode = 200,
                data = cartItems
            });
        }
    }
}
