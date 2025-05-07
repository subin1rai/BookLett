using System;

namespace BookLibrary.DTOs.Response;

public class CartItemDTO
{
    public Guid CartItemId { get; set; }

    public Guid BookId { get; set; }
    public Guid UserId { get; set; }
    public int Quantity { get; set; }

    public BookDTO Book { get; set; } = new BookDTO();
}
