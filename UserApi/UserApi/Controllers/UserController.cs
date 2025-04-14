using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using UserApi.Models;

namespace UserApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class UserController(UserManager<User> userManager) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;

        [HttpGet("{identifier}")]
        public async Task<IActionResult> SearchUser(string identifier)
        {
            var user = new EmailAddressAttribute().IsValid(identifier)
                ? await _userManager.FindByEmailAsync(identifier)
                : await _userManager.FindByNameAsync(identifier);

            if (user == null || user.Id == HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value)
                return NotFound();

            return Ok(new { user.UserName, user.Email, user.FullName, user.AvatarUrl });
        }
    }
}
