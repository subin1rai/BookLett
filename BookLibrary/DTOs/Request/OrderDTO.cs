using System;

namespace BookLibrary.DTOs.Request;

public class OrderDTO
{
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }

    public DateTime OrderDate { get; set; } = DateTime.UtcNow;

    public decimal OriginalTotal { get; set; }

    public decimal DiscountRate { get; set; }
    public decimal FinalTotal { get; set; }

    public string Status { get; set; } = "Pending";
    public string? ClaimCode { get; set; }
    
    public OrderItemDTO orderItem { get; set; } = new OrderItemDTO();
}
