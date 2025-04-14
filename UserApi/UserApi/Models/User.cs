using Microsoft.AspNetCore.Identity;

namespace UserApi.Models
{
    public class User : IdentityUser
    {
        public string? FullName { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<ChatParticipant> ChatParticipants { get; set; } = new List<ChatParticipant>();
    }
}
