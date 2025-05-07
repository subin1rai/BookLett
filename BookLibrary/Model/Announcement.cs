using System;

namespace BookLibrary.Model;

public class Announcement
    {
        public Guid AnnouncementId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Color { get; set; } = string.Empty;
        public string TextColor { get; set; } = string.Empty;
        public bool IsPinned { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
