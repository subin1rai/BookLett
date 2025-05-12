using BookLibrary.Data;
using BookLibrary.DTOs.Request;
using BookLibrary.Model;
using BookLibrary.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        private readonly IHubContext<NotificationHub> _hubContext;


        public OrderController(AuthDbContext context, IEmailService emailService, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _emailService = emailService;
            _hubContext = hubContext;
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
            var body = $@"
    <div style='font-family: Arial, sans-serif; text-align: center; padding: 20px;'>
        <h2 style='font-size: 28px; color: #2c3e50;'>🎉 Order Confirmation 🎉</h2>
        <div style='margin-top: 20px; font-size: 36px; font-weight: bold; color: #27ae60;'>
            {order.ClaimCode}
        </div>
        <p style='margin-top: 30px; font-size: 16px; color: #333;'>Your order has been placed successfully.</p>
        <p><strong>Order ID:</strong> {order.OrderId}</p>
        <p><strong>Total Amount:</strong> Rs. {finalTotal:F2}</p>
        <p><strong>Discount Applied:</strong> {cartLevelDiscount * 100}%</p>
        <p style='margin-top: 20px;'>Thank you for shopping with us!</p>
    </div>";

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


        [HttpGet("all")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return NotFound(new
                {
                    status = "error",
                    message = "No orders found"
                });
            }

            var dtoList = orders.Select(o => new OrderDTO
            {
                OrderId = o.OrderId,
                Username = o.User.Username,
                OrderDate = o.OrderDate,
                FinalTotal = o.FinalTotal,
                DiscountRate = o.DiscountRate,
                Status = o.Status,
                BookTitles = o.OrderItems.Select(i => i.Book.Title).ToList(),
                OrderItems = o.OrderItems.Select(oi => new OrderItemDTO
                {
                    BookId = oi.BookId,
                    Title = oi.Book.Title,
                    Quantity = oi.Quantity,
                    PricePerUnit = oi.PricePerUnit,
                }).ToList()
            }).ToList();


            return Ok(new
            {
                status = "success",
                message = "Orders retrieved successfully",
                data = dtoList
            });
        }


        //order By User
        [HttpGet("userOrder")]
        [Authorize(Policy = "RequireUserRole")]

        public async Task<IActionResult> GetUserOrders()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Token is missing or invalid");

            var userId = Guid.Parse(userClaim.Value);
            var user = await _context.Users.FindAsync(userId);

            var orders = await _context.Orders
            .Where(o => o.UserId == userId)
                .Include(o => o.User)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .ToListAsync();

            if (orders == null || !orders.Any())
            {
                return NotFound(new
                {
                    status = "error",
                    message = "No orders found"
                });
            }

            var dtoList = orders.Select(o => new OrderDTO
            {
                OrderId = o.OrderId,
                Username = o.User.Username,
                OrderDate = o.OrderDate,
                FinalTotal = o.FinalTotal,
                DiscountRate = o.DiscountRate,
                Status = o.Status,
                BookTitles = o.OrderItems.Select(i => i.Book.Title).ToList(),
                OrderItems = o.OrderItems.Select(oi => new OrderItemDTO
                {
                    BookId = oi.BookId,
                    Title = oi.Book.Title,
                    Quantity = oi.Quantity,
                    PricePerUnit = oi.PricePerUnit,
                }).ToList()
            }).ToList();


            return Ok(new
            {
                status = "success",
                message = "Orders retrieved successfully",
                data = dtoList
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
