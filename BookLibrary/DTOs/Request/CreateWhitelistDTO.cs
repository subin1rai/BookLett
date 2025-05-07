using System;

namespace BookLibrary.DTOs.Request;

public class CreateWhitelistDTO
{
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
}

