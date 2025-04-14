using System.ComponentModel.DataAnnotations;

namespace UserApi.Models
{
    public class ChatParticipant
    {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public User User { get; set; } = null!;

        public int ChatId { get; set; }
        public Chat Chat { get; set; } = null!;
    }
}
