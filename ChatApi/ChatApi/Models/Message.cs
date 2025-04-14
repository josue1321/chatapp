using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ChatApi.Models;

public class Message
{
	[BsonId]
	[BsonRepresentation(BsonType.ObjectId)]
	public string? Id { get; set; }
	public string SenderId { get; set; } = null!;
	public int ChatId { get; set; }
	public string? Content { get; set; }
	public DateTime SentAt { get; set; }
	public string Status { get; set; } = null!;
	public string? MediaUrl { get; set; }
	public string? ReplyTo { get; set; }
}