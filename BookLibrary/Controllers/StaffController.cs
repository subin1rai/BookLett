using BookLibrary.Data;
using BookLibrary.DTOs.Request;
using BookLibrary.Model;
using BookLibrary.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

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

            var order = await _context.Orders.FindAsync(id);
            var user = await _context.Users.FindAsync(order.UserId);
            if (order == null)
            {
                return NotFound(new
                {
                    status = "error",
                    message = "Order not found"
                });
            }

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

            if (order.ClaimCode == orders.ClaimCode)
            {
                // Update order status to "Completed"
                order.Status = "Completed";
                order.ClaimCode = null; // Clear the claim code after verification

            }

            await _hubContext.Clients.All.SendAsync("ReceiveMessage", "Purchased Book", $"{user.Username} has purchased the book!");
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
                message = "Order verified successfully"
            });
        }


    }
}
