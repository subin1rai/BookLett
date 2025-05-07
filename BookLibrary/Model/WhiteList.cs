using System;
namespace BookLibrary.Model;

public class WhiteList
{
    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid BookId { get; set; }
    public Book Book { get; set; }

    public DateTime BookmarkedAt { get; set; } = DateTime.UtcNow;
}
