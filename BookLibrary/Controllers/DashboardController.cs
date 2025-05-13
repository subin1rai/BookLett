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

            // Weekly sales data (last 7 days, grouped by DayOfWeek)
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

            // Ensure all 7 days are included in result (Sun to Sat)
            var daysOfWeek = Enum.GetValues(typeof(DayOfWeek)).Cast<DayOfWeek>();
            var weeklySales = daysOfWeek.Select(day => new
            {
                day = day.ToString().Substring(0, 3), // "Sun", "Mon", etc.
                count = weeklyOrders.FirstOrDefault(x => x.Day == day)?.Count ?? 0
            });

            return Ok(new
            {
                totalBooks,
                totalOrders,
                totalCustomers,
                totalRevenue,
                recentNotifications,
                weeklySales
            });
        }
    }
}
