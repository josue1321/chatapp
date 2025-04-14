using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text.RegularExpressions;
using UserApi.Dto;
using UserApi.Interfaces;
using UserApi.Models;

namespace UserApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public partial class AuthController(UserManager<User> userManager, SignInManager<User> signInManager, ITokenService tokenService) : ControllerBase
    {
        private readonly UserManager<User> _userManager = userManager;
        private readonly SignInManager<User> _signInManager = signInManager;
        private readonly ITokenService _tokenService = tokenService;

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterDto userDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (MyRegex().IsMatch(userDto.Username))
                    return BadRequest(new { errors = "Invalid username: spaces and '@' are not allowed" });

                var user = new User
                {
                    UserName = userDto.Username,
                    Email = userDto.Email,
                    CreatedAt = DateTime.Now,
                };

                var result = await _userManager.CreateAsync(user, userDto.Password);

                return !result.Succeeded ? StatusCode(500, (new { errors = result.Errors })) : Ok(new { user.Id, user.UserName, user.Email, token = _tokenService.GenerateToken(user) });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { errors = ex });
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginDto userDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = new EmailAddressAttribute().IsValid(userDto.Identifier)
                ? await _userManager.FindByEmailAsync(userDto.Identifier)
                : await _userManager.FindByNameAsync(userDto.Identifier);

            if (user == null)
                return Unauthorized(new { errors = "Invalid Credentials" });

            var result = await _signInManager.CheckPasswordSignInAsync(user, userDto.Password, false);

            if (!result.Succeeded)
                return Unauthorized(new { errors = "Invalid Credentials" });

            return Ok(new { user.Id, user.UserName, user.Email, user.AvatarUrl, user.FullName, token = _tokenService.GenerateToken(user) });
        }

        [Authorize]
        [HttpGet("Check")]
        public async Task<IActionResult> Check()
        {
            var user = await _userManager.FindByIdAsync(HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

            if (user == null)
                return Unauthorized(new { errors = "User not found or not authenticated" });

            return Ok(new { user.Id, user.UserName, user.Email, user.AvatarUrl, user.FullName });
        }

        [GeneratedRegex(@"[@\s]")]
        private static partial Regex MyRegex();
    }
}
