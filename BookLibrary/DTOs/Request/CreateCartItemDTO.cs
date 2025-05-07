using System;

namespace BookLibrary.DTOs.Request;

public class CreateCartItemDTO
{
    public Guid BookId { get; set; }

    public int Quantity { get; set; }
}
