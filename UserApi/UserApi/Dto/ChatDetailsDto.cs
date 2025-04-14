namespace UserApi.Dto
{
    public class ChatDetailsDto
    {
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string AvatarUrl { get; set; }
        public required string FullName { get; set; }
        public int ChatId { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
