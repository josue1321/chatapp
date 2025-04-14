using UserApi.Models;

namespace UserApi.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}
