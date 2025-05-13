using System;
using System.Linq;
using System.Threading.Tasks;
using BookLibrary.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public DashboardController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<ActionResult> DashboardData()
        {
            // Basic counts
            var totalBooks = await _context.Books.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            var totalCustomers = await _context.Users.CountAsync(u => u.Role == "User");

            // Total revenue from completed orders
            var totalRevenue = await _context.Orders
                .Where(o => o.Status == "Completed")
                .SumAsync(o => (decimal?)o.FinalTotal) ?? 0;

            // 4 Most recent notifications
            var recentNotifications = await _context.Notifications
                .OrderByDescending(n => n.CreatedAt)
                .Take(4)
                .Select(n => new
                {
                    n.NotificationId,
                    n.message,
                    n.CreatedAt
                })
                .ToListAsync();

            // Weekly order counts for past 7 days
            var last7Days = DateTime.UtcNow.Date.AddDays(-6);
            var weeklyOrders = await _context.Orders
                .Where(o => o.OrderDate.Date >= last7Days)
                .GroupBy(o => o.OrderDate.DayOfWeek)
                .Select(g => new
                {
                    Day = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            var daysOfWeek = Enum.GetValues(typeof(DayOfWeek)).Cast<DayOfWeek>();
            var weeklySales = daysOfWeek.Select(day => new
            {
                day = day.ToString().Substring(0, 3),
                count = weeklyOrders.FirstOrDefault(x => x.Day == day)?.Count ?? 0
            });

            // Top 3 recent orders with basic user info
            var recentOrders = await _context.Orders
                .OrderByDescending(o => o.OrderDate)
                .Take(3)
                .Include(o => o.User)
                .Select(o => new
                {
                    o.OrderId,
                    o.OrderDate,
                    o.FinalTotal,
                    o.Status,
                    Username = o.User.Username,
                    Email = o.User.Email
                })
                .ToListAsync();

            // Top 3 recently added books
            var recentBooks = await _context.Books
                .OrderByDescending(b => b.CreatedAt) // Assuming Book has CreatedAt
                .Take(3)
                .Select(b => new
                {
                    b.BookId,
                    b.Title,
                    b.Author,
                    b.Price,
                    b.CreatedAt
                })
                .ToListAsync();

            return Ok(new
            {
                totalBooks,
                totalOrders,
                totalCustomers,
                totalRevenue,
                recentNotifications,
                weeklySales,
                recentOrders,
                recentBooks
            });
        }
    }
}
