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
    public async Task<ActionResult<UserDTO>> Register(RegisterDTO register){
         // Check if username already exists
            if (await _context.Users.AnyAsync(u => u.Username == register.Username))
            {
                return BadRequest("Username is already taken");
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == register.Email))
            {
                return BadRequest("Email is already registered");
            }

            //RANDOMLY GENERATE VERIFY CODE 5 DIGITS
            Random random = new Random();
            int verifyCode = random.Next(10000, 99999);


            // Create new user
            var user = new User
            {
                Username = register.Username,
                Email = register.Email,
                VerificationCode = verifyCode,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(register.Password)
            };

            // Check if this is the first user, if so, make them an Admin
            if (!await _context.Users.AnyAsync())
            {
                user.Role = "Admin";
            }

             var receptor = user.Email;
            var subject = $"Verfication code BOOKLETT";
            var body = $"Your otp is {verifyCode}";
           
            await _emailService.SendEmail(receptor, subject, body);

            // Add user to database
            _context.Users.Add(user);

            await _context.SaveChangesAsync();
            // Return user DTO with token
            return Ok(new{
                status = "success",
                message = "User Registered successful",
                statusCode = 200,
                user = new UserDTO
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role
                },
            });
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
