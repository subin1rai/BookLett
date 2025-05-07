using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model;

public class EmailRequest
{
    [Required]
    public string Receptor { get; set; }

    [Required]
    public string Subject { get; set; }

    [Required]
    public string Body { get; set; }
}
