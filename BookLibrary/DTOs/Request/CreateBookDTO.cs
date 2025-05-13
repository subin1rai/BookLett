using System;

namespace BookLibrary.DTOs.Request;

public class CreateBookDTO
{
    // [Required(ErrorMessage = "Title is required")]
    // [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters")]
    public string Title { get; set; } = string.Empty;

    // [Required(ErrorMessage = "Auther name is required")]
    // [StringLength(50, ErrorMessage = "Author name cannot be longer than 50 characters")]
    // [RegularExpression(@"^[a-zA-Z\s]+$", ErrorMessage = "Author name can only contain letters")]
    public string Author { get; set; } = string.Empty;


    // [Required(ErrorMessage = "Genre is required")]
    public string Genre { get; set; } = string.Empty;
    public bool  AwardWinners {get; set;} 


    // [Required(ErrorMessage = "ISBN is required")]
    public string ISBN { get; set; } = string.Empty;


    // [Required(ErrorMessage = "Description is required")]
    // [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters")]
    public string Description { get; set; } = string.Empty;

    // [Required(ErrorMessage = "Publisher is required")]
    // [StringLength(50, ErrorMessage = "Publisher name cannot be longer than 50 characters")]
    public string Publisher { get; set; } = string.Empty;


    // [Required(ErrorMessage = "Publication date is required")]
    // [DataType(DataType.Date)]

    public DateTime PublicationDate { get; set; }

    // [Required(ErrorMessage = "Price is required")]
    public int Price { get; set; }= 0;

    // [Required(ErrorMessage = "Quantity is required")]
    // [Range(1, int.MaxValue, ErrorMessage = "Quantity must be greater than 0")]
    public int Quantity { get; set; }
    public string Format { get; set; } = string.Empty;

    public int Discount { get; set; } = 0;

    public string Language { get; set; } = string.Empty;


    // [Required(ErrorMessage = "Image URL is required")]
    public string ImageUrl { get; set; } = string.Empty;

    public bool AvailableInLibrary { get; set; } = true;

    public bool IsOnSale { get; set; } = false;
}
