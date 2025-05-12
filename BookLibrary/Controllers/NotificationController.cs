using BookLibrary.Data;
using BookLibrary.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BookLibrary.Controllers
{
    [Route("api/notification")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public NotificationController(AuthDbContext context) 
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<ActionResult> AllNotification()
        {
            var notifications = await _context.Notifications.ToListAsync();
            return Ok(new
            {
                status = "success",
                statusCode = 200,
                data = notifications
            });
        }
    }
}
