using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.DTOs.Request;


public class LoginDTO
{
        [Required]
        public string Username { get; set; } = string.Empty;

        public bool IsVerified { get; set; } = false;


        [Required]
        public string Password { get; set; } = string.Empty;
}
