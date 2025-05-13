using System.Security.Claims;
using BookLibrary.Data;
using BookLibrary.DTOs.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/user")]
    [ApiController]
    [Authorize] // All endpoints require authentication
    public class UserController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public UserController(AuthDbContext context)
        {
            _context = context;
        }


        [HttpGet("getallusers")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<object>> GetUsers(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? search = null)
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

            var query = _context.Users
                .Where(u => u.Role != "Admin");

            // Apply search filter
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u =>
                    u.Username.Contains(search) ||
                    u.Email.Contains(search));
            }

            // Apply ordering - newest first
            query = query.OrderByDescending(u => u.CreatedAt);

            var totalUsers = await query.CountAsync();

            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = users.Select(u => new UserDTO
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                IsVerified= u.IsVerified
            }).ToList();

            return Ok(new
            {
                status = "success",
                currentPage = page,
                pageSize,
                totalCount = totalUsers,
                totalPages = (int)Math.Ceiling(totalUsers / (double)pageSize),
                data = userDtos
            });
        }

        [HttpGet("getAllStaffs")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<ActionResult<object>> GetStaffs(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? search = null)
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

            // ✅ Filter only users with "Staff" role
            var query = _context.Users
                .Where(u => u.Role == "Staff");

            // Apply search filter
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u =>
                    u.Username.Contains(search) ||
                    u.Email.Contains(search));
            }

            // Apply ordering - newest first
            query = query.OrderByDescending(u => u.CreatedAt);

            var totalUsers = await query.CountAsync();

            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = users.Select(u => new UserDTO
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                IsVerified= u.IsVerified
            }).ToList();

            return Ok(new
            {
                status = "success",
                currentPage = page,
                pageSize,
                totalCount = totalUsers,
                totalPages = (int)Math.Ceiling(totalUsers / (double)pageSize),
                data = userDtos
            });
        }

[HttpGet("getAllUsers")]
        [Authorize(Policy = "RequireStaffRole")]
        public async Task<ActionResult<object>> GetUser(
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? search = null)
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

            // ✅ Filter only users with "User" role
            var query = _context.Users
                .Where(u => u.Role == "User");

            // Apply search filter
            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(u =>
                    u.Username.Contains(search) ||
                    u.Email.Contains(search));
            }

            // Apply ordering - newest first
            query = query.OrderByDescending(u => u.CreatedAt);

            var totalUsers = await query.CountAsync();

            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = users.Select(u => new UserDTO
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt,
                IsVerified= u.IsVerified
            }).ToList();

            return Ok(new
            {
                status = "success",
                currentPage = page,
                pageSize,
                totalCount = totalUsers,
                totalPages = (int)Math.Ceiling(totalUsers / (double)pageSize),
                data = userDtos
            });
        }

        [HttpGet("getuserbyid/{id}")]
        public async Task<ActionResult<UserDTO>> GetUser(Guid id)
        {
            // Get the current user's ID and role from the token
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userClaim == null) return Unauthorized("Invalid!! Token is missing");

            var userId = Guid.Parse(userClaim.Value);

            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            // Check if the user is requesting their own data or is an Admin
            if (id != userId && userRole != "Admin")
            {
                return Forbid();
            }

            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            // Map user to UserDTO
            var userDto = new UserDTO
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role
            };

            return userDto;
        }

        [HttpPut("updaterole/{id}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> UpdateUserRole(Guid id, [FromBody] string role)
        {
            // Validate role
            if (role != "Admin" && role != "User" && role != "Staff")
            {
                return BadRequest("Invalid role. Role must be 'Admin' or 'User'");
            }
            // Find user by ID
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Update user role
            user.Role = role;

            // Save changes to database
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // Helper method to check if a user exists
        private bool UserExists(Guid id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        [HttpGet]
        [Authorize(Policy = "RequireUserRole")]
        public async Task<ActionResult> GetDiscount()
        {
            var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userClaim == null)
                return Unauthorized("Invalid! Token is missing");

            var userId = Guid.Parse(userClaim.Value);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound("User not found");

            var hasDiscount = user.CompleteOrderCount == 10;

            var discountRate = 0.10m; // 10% discount

            return Ok(new
            {
                status = "success",
                message = "Discount information retrieved successfully",
                statusCode = 200,
                data = new
                {
                    hasDiscount,
                    discountRate
                }
            });
        }
    }


}
