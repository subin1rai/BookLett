using System;

namespace BookLibrary.DTOs.Request;

public class AnnouncementDTO
{
 public Guid AnnouncementId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Color { get; set; } = string.Empty;
        public string TextColor { get; set; } = string.Empty;
        public bool IsPinned { get; set; } = false;
}
