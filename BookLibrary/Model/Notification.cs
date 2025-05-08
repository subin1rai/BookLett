using System;
using System.ComponentModel.DataAnnotations;

namespace BookLibrary.Model;

public class Notification
{
    [Key]
    public Guid NotificationId {get; set;}
    public string message {get; set;}
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}
