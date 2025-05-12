using System;

namespace BookLibrary.DTOs.Request;

public class verifyDTO
{
    public Guid Id { get; set; }

    public int? VerificationCode { get; set; }

    public string? Password { get; set; } = string.Empty;

    public string? ConfirmPassword { get; set; } = string.Empty;
}
