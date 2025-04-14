using ChatApi.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ChatApi.Services;

public class MessageService
{
    private readonly IMongoCollection<Message> _messageCollection;

    public MessageService(IOptions<MongoDbSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _messageCollection = database.GetCollection<Message>("Messages");
    }

    public async Task<List<Message>> GetMessagesAsync(int chatId, DateTime? before = null)
    {
        var filterBuilder = Builders<Message>.Filter;
        var filters = new List<FilterDefinition<Message>>
        {
            filterBuilder.Eq(msg => msg.ChatId, chatId)
        };

        if (before.HasValue)
            filters.Add(filterBuilder.Lt(msg => msg.SentAt, before));

        var finalFilter = filterBuilder.And(filters);

        return await _messageCollection
            .Find(finalFilter)
            .SortByDescending(msg => msg.SentAt)
            .Limit(50)
            .ToListAsync();
    }

    public async Task SetChatMessageReadAsync(string messageId)
    {
        var filter = Builders<Message>.Filter.Eq(msg => msg.Id, messageId);
        var update = Builders<Message>.Update.Set(msg => msg.Status, "Read");

        await _messageCollection.UpdateOneAsync(filter, update);
    }

    public async Task SetChatMessagesReadAsync(int chatId, string receiverId)
    {
        var filter = Builders<Message>.Filter.And(
            Builders<Message>.Filter.Eq(msg => msg.ChatId, chatId),
            Builders<Message>.Filter.Eq(msg => msg.Status, "Sent"),
            Builders<Message>.Filter.Ne(msg => msg.SenderId, receiverId)
        );
        var update = Builders<Message>.Update.Set(msg => msg.Status, "Read");

        await _messageCollection.UpdateManyAsync(filter, update);
    }

    public async Task AddMessageAsync(Message message) => await _messageCollection.InsertOneAsync(message);
}