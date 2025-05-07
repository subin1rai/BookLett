using BookLibrary.Data;
using BookLibrary.Model;
using BookLibrary.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BookLibrary.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly IEmailService _emailService;

        public OrderController(AuthDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // Place Order - Accessible to Users
        [HttpPost("place")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<IActionResult> PlaceOrder()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Token is missing or invalid");

            var userId = Guid.Parse(userClaim.Value);
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null) return NotFound("User not found");

            var cartItems = await _context.CartItems
                .Include(c => c.Book)
                .Where(c => c.UserId == userId)
                .ToListAsync();

            if (!cartItems.Any())
                return BadRequest("Cart is empty");

            var totalQuantity = cartItems.Sum(c => c.Quantity);

            // Apply book-level discounts
            decimal subtotalAfterBookDiscounts = cartItems.Sum(c =>
                c.Quantity * (c.PricePerUnit * (1 - c.Book.Discount / 100m))
            );

            //Apply cart-level discount if applicable
            decimal cartLevelDiscount = (totalQuantity >= 5) ? 0.05m : 0;

            // Step 3: Extra 10% if user has 10 completed orders
            if (user.CompleteOrderCount == 10)
            {
                cartLevelDiscount += 0.10m;
                // Reset after 10 completed orders
                user.CompleteOrderCount = 0;
            }

            decimal finalTotal = subtotalAfterBookDiscounts * (1 - cartLevelDiscount);

            var order = new Order
            {
                OrderId = Guid.NewGuid(),
                UserId = userId,
                OrderDate = DateTime.UtcNow,
                OriginalTotal = subtotalAfterBookDiscounts,
                DiscountRate = cartLevelDiscount,
                FinalTotal = finalTotal,
                Status = "Pending",
                ClaimCode = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(),
                OrderItems = new List<OrderItem>()
            };

            foreach (var item in cartItems)
            {
                order.OrderItems.Add(new OrderItem
                {
                    OrderItemId = Guid.NewGuid(),
                    OrderId = order.OrderId,
                    BookId = item.BookId,
                    UserId = userId,
                    Quantity = item.Quantity,
                    PricePerUnit = item.PricePerUnit
                });
            }
            var receptor = user.Email;
            var subject = $"Order Confirmation Details - Order ID: {order.OrderId}";
            var body = $"Your order has been placed successfully. Order ID: {order.OrderId}. Claim Code: {order.ClaimCode}. Total Amount: {finalTotal}. Discount Applied: {cartLevelDiscount * 100}%.";
            await _emailService.SendEmail(receptor, subject, body);
            // await 
            _context.Orders.Add(order);
            _context.CartItems.RemoveRange(cartItems);
            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                message = "Order placed successfully",
                statusCode = 200,
                data = new
                {
                    orderId = order.OrderId,
                    claimCode = order.ClaimCode,
                    totalAmount = order.FinalTotal,
                    discountApplied = $"{cartLevelDiscount * 100}%"
                }
            });
        }



        [HttpPut("cancel/{orderId}")]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<ActionResult> CancelOrder(Guid orderId)
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Token is missing or invalid");

            var userId = Guid.Parse(userClaim.Value);
            var user = await _context.Users.FindAsync(userId);
            
            if (user == null) return NotFound("User not found");

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.OrderId == orderId && o.UserId == userId);

            if (order == null) return NotFound("Order not found");

            // Check if the order is already completed or cancelled
            if (order.Status == "Completed" || order.Status == "Cancelled")
                return BadRequest("Cannot cancel a completed or already cancelled order");

            // Update the order status to "Cancelled"
            order.Status = "Cancelled";
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                message = "Order cancelled successfully",
                statusCode = 200,
                data = new
                {
                    orderId = order.OrderId,
                    status = order.Status
                }
            });
        }

        [HttpPost("sendEmail")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _emailService.SendEmail(request.Receptor, request.Subject, request.Body);
            return Ok(new
            {
                status = "success",
                message = "Email sent successfully",
                statusCode = 200
            });
        }

    }
}
