using System;
using BookLibrary.Model;
using Microsoft.EntityFrameworkCore;

namespace BookLibrary.Data;

public class AuthDbContext : DbContext
{
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<WhiteList> Whitelists { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Notification>  Notifications { get; set; }

        public DbSet<Rating> Reviews { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
                base.OnModelCreating(modelBuilder);
                // Wishlist configuration
                modelBuilder.Entity<WhiteList>()
                    .HasKey(w => new { w.UserId, w.BookId });

                modelBuilder.Entity<WhiteList>()
                    .HasOne(w => w.User)
                    .WithMany(u => u.Whitelists)
                    .HasForeignKey(w => w.UserId);

                modelBuilder.Entity<WhiteList>()
                    .HasOne(w => w.Book)
                    .WithMany(b => b.Whitelists)
                    .HasForeignKey(w => w.BookId);

        }

}