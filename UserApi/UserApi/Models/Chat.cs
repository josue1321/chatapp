using System.ComponentModel.DataAnnotations;

namespace UserApi.Models
{
    public class Chat
    {
        [Key]
        public int Id { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        public ICollection<ChatParticipant> Participants { get; set; } = new List<ChatParticipant>();
    }
}
