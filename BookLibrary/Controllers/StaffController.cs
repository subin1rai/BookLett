using BookLibrary.Data;
using BookLibrary.DTOs.Request;
using BookLibrary.Model;
using BookLibrary.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/staff")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        public readonly AuthDbContext _context;
        private readonly IHubContext<NotificationHub> _hubContext;



        public StaffController(AuthDbContext context, IHubContext<NotificationHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;

        }

        [HttpPut("verifyOrder/{id}")]
        [Authorize(Roles = "Admin, Staff")]
        public async Task<IActionResult> VerifyOrder(Guid id, OrderDTO orders)
        {
            if (orders.ClaimCode == null)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Claim code is required"
                });
            }

            var order = await _context.Orders
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Book)
                .FirstOrDefaultAsync(o => o.OrderId == id);

            if (order == null)
            {
                return NotFound(new
                {
                    status = "error",
                    message = "Order not found"
                });
            }

            var user = await _context.Users.FindAsync(order.UserId);

            if (order.ClaimCode != orders.ClaimCode)
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Invalid claim code"
                });
            }

            if (order.Status == "Completed")
            {
                return BadRequest(new
                {
                    status = "error",
                    message = "Order already completed"
                });
            }

            // Deduct stock quantities
            foreach (var item in order.OrderItems)
            {
            var books = item.Book.Title; 
                if (item.Book.Quantity < item.Quantity)
                {
                    return BadRequest(new
                    {
                        status = "error",
                        message = $"Not enough stock for book: {item.Book.Title}"
                    });
                }

                item.Book.Quantity -= item.Quantity;
                _context.Books.Update(item.Book);
            }

            // Update order status
            order.Status = "Completed";
            order.ClaimCode = null;

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Purchased Book", $"{user.Username} has purchased the book ");

            var addNotification = new Notification
            {
                message = $"{user.Username} has purchased the book!"
            };

            _context.Orders.Update(order);
            _context.Notifications.Add(addNotification);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                message = "Order verified and stock updated successfully"
            });
        } 

    }
}
