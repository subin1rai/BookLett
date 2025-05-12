using System;

namespace BookLibrary.DTOs.Response;

public class BookDTO
{
    public Guid BookId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Genre { get; set; } = string.Empty;
    public string ISBN { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public string Publisher { get; set; } = string.Empty;

    public DateTime PublicationDate { get; set; }
    public bool  AwardWinners {get; set;} 

    public int Price { get; set; }

    public int Quantity { get; set; }
    public string Language { get; set; }
    public int Discount { get; set; } = 0;
    public string Format { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public bool AvailableInLibrary { get; set; } = true;

    public bool IsOnSale { get; set; } = false;
    
    public DateTime? StartTime {get; set;}
    public DateTime? EndTime {get; set;}

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
}
