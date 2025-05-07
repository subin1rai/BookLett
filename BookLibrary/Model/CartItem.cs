using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookLibrary.Model;

public class CartItem
{
    [Key]
    public Guid CartItemId { get; set; }

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
    public int Quantity { get; set; }

    [Required]

    public decimal PricePerUnit { get; set; } 

    public decimal TotalPrice => Quantity * PricePerUnit;
    public Guid UserId { get; set; }
    public Guid BookId { get; set; }
     [ForeignKey("UserId")]
    public User? User { get; set; }
     [ForeignKey("BookId")]
    public Book? Book { get; set; }
}

