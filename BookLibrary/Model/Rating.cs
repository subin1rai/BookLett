using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Model;

public class Rating
{
    [Key]
    public Guid ReviewId { get; set; }

    [Required]
    public Guid BookId { get; set; }

    [Required]
    public Guid UserId { get; set; }

    [Required(ErrorMessage = "Rating is required")]
    [Range(1, 5, ErrorMessage = "Stars must be between 1 and 5")]
    public int Stars { get; set; }
    [Required]
    public string Comment { get; set; } = string.Empty;

    [ForeignKey("BookId")]
    public Book Book { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; }
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}
