using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace UserApi.Models
{
    public class UserDbContext(DbContextOptions<UserDbContext> options) : IdentityDbContext<User>(options)
    {
        public DbSet<Chat> Chats { get; set; }
        public DbSet<ChatParticipant> ChatParticipants { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Chat>()
                .HasMany(c => c.Participants)
                .WithOne(cp => cp.Chat)
                .HasForeignKey(cp => cp.ChatId);

            builder.Entity<User>()
                .HasMany(u => u.ChatParticipants)
                .WithOne(cp => cp.User)
                .HasForeignKey(cp => cp.UserId);

            builder.Entity<ChatParticipant>()
                .HasIndex(cp => new { cp.ChatId, cp.UserId })
                .IsUnique();
        }
    }
}
