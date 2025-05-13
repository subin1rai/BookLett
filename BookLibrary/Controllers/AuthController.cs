using BookLibrary.Data;
using BookLibrary.DTOs.Request;
using BookLibrary.DTOs.Response;
using BookLibrary.Model;
using BookLibrary.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthDbContext _context;
        private readonly TokenServices _token;
        private readonly IEmailService _emailService;


        public AuthController(AuthDbContext context, TokenServices token, IEmailService emailService)
        {
            _context = context;
            _token = token;
            _emailService = emailService;
        }


        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO register)
        {
            try
            {
                Console.WriteLine("📩 Register endpoint hit");

                // Check if username exists
                if (await _context.Users.AnyAsync(u => u.Username == register.Username))
                {
                    Console.WriteLine("⚠️ Username already taken");
                    return BadRequest("Username is already taken");
                }

                // Check if email exists
                if (await _context.Users.AnyAsync(u => u.Email == register.Email))
                {
                    Console.WriteLine("⚠️ Email already registered");
                    return BadRequest("Email is already registered");
                }

                // Generate 5-digit verification code
                var verifyCode = new Random().Next(10000, 99999);

                var user = new User
                {
                    Username = register.Username,
                    Email = register.Email,
                    VerificationCode = verifyCode,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(register.Password),
                    Role = "User"
                };

                // Make first user an Admin
                if (!await _context.Users.AnyAsync())
                {
                    user.Role = "Admin";
                    Console.WriteLine("👑 First user assigned as Admin");
                }

                // Send verification email
                try
                {
                    string subject = "Verification Code - Booklett";
                    string body = $"Your OTP is {verifyCode}";
                    await _emailService.SendEmail(user.Email, subject, body);
                    Console.WriteLine("✅ Verification email sent");
                }
                catch (Exception emailEx)
                {
                    Console.WriteLine($"❌ Email sending failed: {emailEx.Message}");
                    // Continue registration even if email fails
                }

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                Console.WriteLine("✅ User saved to database");

                return Ok(new
                {
                    status = "success",
                    message = "User registered successfully",
                    statusCode = 200,
                    user = new UserDTO
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        Role = user.Role
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"🔥 Unexpected error in Register: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, new { error = "An unexpected error occurred." });
            }
        }

        // POST: api/Auth/login
        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(LoginDTO loginDto)
        {
            // Find user by username
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

            // Check if user exists
            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }

            if (user.IsVerified == false)
            {
                return Unauthorized("Please Verify user Account !");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid username or password");
            }

            // Generate JWT token
            var token = _token.GenerateToken(user);


            // Return token and user information
            return Ok(new
            {
                status = "success",
                message = "Login successful",
                statusCode = 200,
                Token = token,
                User = new UserDTO
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }


        //verify user
        [HttpPut("verify")]
        public async Task<ActionResult<object>> VerifyUser(verifyDTO verifyDTO)
        {
            // Find user by ID
            var user = await _context.Users.FindAsync(verifyDTO.Id);

            // Check if user exists
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Check if verification code matches
            if (user.VerificationCode != verifyDTO.VerificationCode)
            {
                return BadRequest("Invalid verification code");
            }

            // Update user status to verified
            user.IsVerified = true;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                status = "success",
                message = "User verified successfully",
                statusCode = 200,
                User = new UserDTO
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role
                }
            });
        }

    }
}
