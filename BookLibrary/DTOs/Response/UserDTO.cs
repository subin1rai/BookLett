using System;

namespace BookLibrary.DTOs.Response;


public class UserDTO
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set;} 
    public Boolean IsVerified { get; set;}
}