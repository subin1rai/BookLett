using System;

namespace BookLibrary.DTOs.Response;

public class WhitelistDTO
{
    public Guid UserId { get; set; }
    public string Username { get; set; }

    public Guid BookId { get; set; }
    public string BookTitle { get; set; }
}
