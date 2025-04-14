using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System.Security.Claims;
using UserApi.Dto;
using UserApi.Models;

namespace UserApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController(UserDbContext context, UserManager<User> userManager, IMemoryCache memoryCache)
        : ControllerBase
    {
        private readonly UserDbContext _context = context;
        private readonly UserManager<User> _userManager = userManager;
        private readonly IMemoryCache _memoryCache = memoryCache;

        [HttpGet("GetUserChats")]
        public async Task<IActionResult> GetUserChats()
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (_memoryCache.TryGetValue($"UserChats_{userId}", out List<ChatDetailsDto>? chatDetails))
                return Ok(chatDetails);

            chatDetails = await _context.ChatParticipants
                .Where(cp => cp.UserId == userId)
                .SelectMany(cp => _context.ChatParticipants
                    .Where(cp2 => cp2.ChatId == cp.ChatId && cp2.UserId != userId)
                    .Select(cp2 => new ChatDetailsDto
                    {
                        UserName = cp2.User.UserName!,
                        Email = cp2.User.Email!,
                        AvatarUrl = cp2.User.AvatarUrl!,
                        FullName = cp2.User.FullName!,
                        ChatId = cp2.ChatId,
                        UpdatedAt = cp2.Chat.UpdatedAt
                    })
                )
                .ToListAsync();

            _memoryCache.Set($"UserChats_{userId}", chatDetails, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                SlidingExpiration = TimeSpan.FromMinutes(5)
            });

            return Ok(chatDetails);
        }

        [HttpGet("GetChatUsers/{chatId:int}")]
        public async Task<IActionResult> GetChatUsers(int chatId)
        {
            try
            {
                if (_memoryCache.TryGetValue($"ChatUsers_{chatId}", out List<string>? usersId)) return Ok(usersId);

                usersId = await _context.ChatParticipants
                    .Where(cp => cp.ChatId == chatId)
                    .Select(cp => cp.UserId)
                    .ToListAsync();

                _memoryCache.Set($"ChatUsers_{chatId}", usersId);

                return Ok(usersId);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    new { message = "An error occurred while fetching chat users.", error = ex.Message });
            }
        }

        [HttpPut("UpdateChatLastMessageTime")]
        public async Task<IActionResult> UpdateChatLastMessageTime(UpdateLastMessageTimeDto updateInfo)
        {
            var chat = await _context.Chats.FindAsync(updateInfo.ChatId);

            if (chat == null)
            {
                return BadRequest();
            }

            chat.UpdatedAt = updateInfo.UpdateAt;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, new { message = "An error occurred while fetching chat users." });
            }

            return NoContent();
        }

        [HttpGet("GetSearchedUserChat/{username}")]
        public async Task<IActionResult> GetSearchedUserChat(string username)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var searchedUser = await _userManager.FindByNameAsync(username);

            if (searchedUser == null || userId == searchedUser.Id)
                return BadRequest();

            var sharedChatId = await _context.ChatParticipants
                .Where(cp => cp.UserId == userId)
                .Select(cp => cp.ChatId)
                .Intersect(
                    _context.ChatParticipants
                        .Where(cp => cp.UserId == searchedUser.Id)
                        .Select(cp => cp.ChatId)
                )
                .FirstOrDefaultAsync();

            return Ok(new { id = sharedChatId });
        }

        [HttpPost("CreateDmChat")]
        public async Task<IActionResult> CreateDmChat([FromBody] string receiverUserName)
        {
            var senderId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var receiver = await _userManager.FindByNameAsync(receiverUserName);

            if (receiver == null) return BadRequest();

            await using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                Chat newChat = new()
                {
                    UpdatedAt = DateTimeOffset.UtcNow,
                };

                _context.Chats.Add(newChat);
                await _context.SaveChangesAsync();

                var chatParticipants = new List<ChatParticipant>
                {
                    new() { ChatId = newChat.Id, UserId = senderId! },
                    new() { ChatId = newChat.Id, UserId = receiver.Id }
                };

                _context.ChatParticipants.AddRange(chatParticipants);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                if (_memoryCache.TryGetValue($"UserChats_{senderId!}", out List<ChatDetailsDto>? senderChats))
                    _memoryCache.Remove($"UserChats_{senderId!}");
                if (_memoryCache.TryGetValue($"UserChats_{receiver.Id}", out List<ChatDetailsDto>? receiverChats))
                    _memoryCache.Remove($"UserChats_{receiver.Id}");

                return Ok(new { chatId = newChat.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500,
                    new { message = "An error occurred while fetching chat users.", error = ex.Message });
            }
        }
    }
}