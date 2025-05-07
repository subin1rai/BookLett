using System;

namespace BookLibrary.DTOs.Request;

public class OrderItemDTO
{
    public Guid BookId { get; set; }

    public string Title { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public decimal PricePerUnit { get; set; }

    public decimal TotalPrice => Quantity * PricePerUnit;
}