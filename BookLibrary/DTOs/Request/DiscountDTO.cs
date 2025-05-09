using System;

namespace BookLibrary.DTOs.Request;

public class DiscountDTO
{
    public int Discount { get; set; } = 0;
    public bool IsOnSale { get; set; } = false;
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
}
