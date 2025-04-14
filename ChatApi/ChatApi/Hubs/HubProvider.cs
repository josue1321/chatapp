using System.Net.Http.Headers;
using System.Security.Claims;
using ChatApi.Helpers;
using ChatApi.Models;
using ChatApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;

namespace ChatApi.Hubs
{
    [Authorize]
    public class HubProvider(MessageService messageService, IMemoryCache memoryCache, HttpClient httpClient, IConfiguration config) : Hub
    {
        private readonly MessageService _messageService = messageService;
        private readonly IMemoryCache _memoryCache = memoryCache;
        private readonly HttpClient _httpClient = httpClient;
        private readonly IConfiguration _config = config;

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;


            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;


            await base.OnDisconnectedAsync(exception);
        }

        public async Task<IEnumerable<Message>?> GetChatInitialMessages(int chatId)
        {
            if (_memoryCache.TryGetValue($"ChatMessages_{chatId}", out List<Message>? messages)) return messages;
            messages = await _messageService.GetMessagesAsync(chatId);
            messages = messages.OrderBy(msg => msg.SentAt).ToList();

            _memoryCache.Set($"ChatMessages_{chatId}", messages, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                SlidingExpiration = TimeSpan.FromMinutes(5)
            });

            return messages;
        }

        public async Task<IEnumerable<Message>> GetChatOlderMessages(int chatId, DateTime olderThan)
        {
            var messages = await _messageService.GetMessagesAsync(chatId, olderThan);
            messages = messages.OrderBy(msg => msg.SentAt).ToList();

            return messages;
        }

        public async Task SetChatMessageRead(string messageId, int chatId)
        {
            await _messageService.SetChatMessageReadAsync(messageId);

            var receiverId = Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (_memoryCache.TryGetValue($"ChatMessages_{chatId}", out List<Message>? messages) && messages != null)
            {
                messages.LastOrDefault()!.Status = "Read";

                _memoryCache.Set($"ChatMessages_{chatId}", messages, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                    SlidingExpiration = TimeSpan.FromMinutes(5)
                });
            }

            using var requestMessage = new HttpRequestMessage(HttpMethod.Get,
                $"{_config.GetSection("AppSettings:UserApi").Value}/Chat/GetChatUsers/{chatId}");

            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer",
                Context.GetHttpContext()?.Request.Query["access_token"].ToString());

            var response = await _httpClient.SendAsync(requestMessage);
            response.EnsureSuccessStatusCode();

            var chatUsers = await response.Content.ReadFromJsonAsync<string[]>();

            await Clients.Users(chatUsers!).SendAsync("UpdateReadMessages", chatId, receiverId);
        }

        public async Task SetChatMessagesRead(int chatId)
        {
            var receiverId = Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            await _messageService.SetChatMessagesReadAsync(chatId, receiverId!);

            if (_memoryCache.TryGetValue($"ChatMessages_{chatId}", out List<Message>? messages) && messages != null)
            {
                messages
                    .Where(message => message.Status == "Sent" && message.SenderId != receiverId).ToList()
                    .ForEach(message => message.Status = "Read");

                _memoryCache.Set($"ChatMessages_{chatId}", messages, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                    SlidingExpiration = TimeSpan.FromMinutes(5)
                });
            }

            using var requestMessage = new HttpRequestMessage(HttpMethod.Get,
                $"{_config.GetSection("AppSettings:UserApi").Value}/Chat/GetChatUsers/{chatId}");

            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer",
                Context.GetHttpContext()?.Request.Query["access_token"].ToString());

            var response = await _httpClient.SendAsync(requestMessage);
            response.EnsureSuccessStatusCode();

            var chatUsers = await response.Content.ReadFromJsonAsync<string[]>();

            await Clients.Users(chatUsers!).SendAsync("UpdateReadMessages", chatId, receiverId);
        }

        public async Task<Message?> GetChatLastMessage(int chatId)
        {
            try
            {
                if (_memoryCache.TryGetValue($"ChatMessages_{chatId}", out List<Message>? messages) && messages != null)
                    return messages.LastOrDefault();

                messages = await _messageService.GetMessagesAsync(chatId);
                messages = messages.OrderBy(msg => msg.SentAt).ToList();

                _memoryCache.Set($"ChatMessages_{chatId}", messages, new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                    SlidingExpiration = TimeSpan.FromMinutes(5)
                });

                return messages.LastOrDefault();
            }
            catch (InvalidOperationException)
            {
                return null;
            }
        }

        public async Task<int> GetChatSentMessages(int chatId)
        {
            var userId = Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            if (_memoryCache.TryGetValue($"ChatMessages_{chatId}", out List<Message>? messages) && messages != null)
                return messages.Count(message => message.SenderId != userId && message.Status == "Sent");

            messages = await _messageService.GetMessagesAsync(chatId);
            messages = messages.OrderBy(msg => msg.SentAt).ToList();

            _memoryCache.Set($"ChatMessages_{chatId}", messages, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                SlidingExpiration = TimeSpan.FromMinutes(5)
            });

            return messages.Count(message =>
                message.ChatId == chatId && message.SenderId != userId && message.Status == "Sent");
        }

        public async Task SendMessage(Message message, int newMessageIndex)
        {
            try
            {
                if (message.ChatId <= 0)
                    throw new ArgumentException("ChatId must be greater than zero.");

                if (!MessageSanitizer.IsValidAfterSanitize(message.Content!))
                    throw new ArgumentException("Content must contain at least one alphanumeric character.");

                message.Content = MessageSanitizer.SanitizeMessage(message.Content!);

                message.Id = null;
                message.SenderId =
                    Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value!;
                message.SentAt = DateTime.Now;
                message.Status = "Sent";

                await _messageService.AddMessageAsync(message);

                if (_memoryCache.TryGetValue($"ChatMessages_{message.ChatId}", out List<Message>? messages))
                {
                    messages?.Add(message);
                    _memoryCache.Set($"ChatMessages_{message.ChatId}", messages, new MemoryCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10),
                        SlidingExpiration = TimeSpan.FromMinutes(5)
                    });
                }

                using var requestMessage = new HttpRequestMessage(HttpMethod.Get,
                    $"{_config.GetSection("AppSettings:UserApi").Value}/Chat/GetChatUsers/{message.ChatId}");

                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer",
                    Context.GetHttpContext()?.Request.Query["access_token"].ToString());

                var response = await _httpClient.SendAsync(requestMessage);
                response.EnsureSuccessStatusCode();

                var chatUsers = await response.Content.ReadFromJsonAsync<string[]>();

                await Clients.Users(chatUsers!).SendAsync("ReceiveMessage", message, newMessageIndex);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex + " Error at sending message");
                message.Status = "Error";
                await Clients
                    .User(Context.User?.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value!)
                    .SendAsync("ErrorSendingMessage", message, newMessageIndex);
            }
        }
    }
}