using System;

namespace BookLibrary.DTOs.Request;

public class ReviewDTO
{
    public Guid ReviewId { get; set; }
    public Guid BookId { get; set; }

    public Guid UserId { get; set; }

    public int Stars { get; set; }
    public string? Username { get; set; } = null;
    public string Comment { get; set; } = string.Empty;
}
