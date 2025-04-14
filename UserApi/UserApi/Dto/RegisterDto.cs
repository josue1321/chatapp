using System.ComponentModel.DataAnnotations;

namespace UserApi.Dto
{
    public class RegisterDto
    {
        public string Username { get; set; } = null!;
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}
