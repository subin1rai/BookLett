using BookLibrary.Data;
using BookLibrary.DTOs.Request;
using BookLibrary.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/announcement")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {
        public readonly AuthDbContext _context;

        public AnnouncementController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpPost("addAnnouncement")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult> AddAnnouncement(AnnouncementDTO announcement)
        {
            if (string.IsNullOrEmpty(announcement.Message))
            {
                return BadRequest(new
                {
                    status = "error",
                    code = 400,
                    message = "Announcement cannot be empty"
                });
            }
            // Console.WriteLine("color ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",announcement.Color);
            var newAnnouncement = new Announcement
            {
                AnnouncementId = Guid.NewGuid(),
                Message = announcement.Message,
                StartTime = announcement.StartTime,
                Color = announcement.Color,
                TextColor = announcement.TextColor,
                EndTime = announcement.EndTime,
                IsPinned = announcement.IsPinned ? true : false,
            };

            _context.Announcements.Add(newAnnouncement);
            await _context.SaveChangesAsync();  

            return Ok(new
            {
                status = "success",
                message = "Announcement added successfully",
                data = newAnnouncement
            });
        }

        [HttpGet("active")]

        public ActionResult GetActiveAnnouncement()
        {
            var now = DateTime.UtcNow;

            var active = _context.Announcements
                .Where(a =>
                    a.StartTime <= now && a.EndTime >= now && a.IsPinned == true
                )
                .OrderByDescending(a => a.CreatedAt)
                .FirstOrDefault();

            if (active == null)
            {
                return Ok(new { active = false });
            }

            return Ok(new
            {
                active = true,
                message = active.Message,
                start = active.StartTime,
                end = active.EndTime,
                color = active.Color,    
                textColor = active.TextColor
            });
        }



        [HttpGet("all")]
        [Authorize(Policy = "RequireAdminRole")]
        public ActionResult GetAllAnnouncements()
        {
            var announcements = _context.Announcements
                .OrderByDescending(a => a.CreatedAt)
                .ToList();

            if (announcements.Count == 0)
            {
                return Ok(new
                {
                    status = "success",
                    message = "No announcements found",
                    data = new List<Announcement>()
                });
            }

            return Ok(new
            {
                status = "success",
                message = "Announcements retrieved successfully",
                data = announcements
            });
        }

    }
}
