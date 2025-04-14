using System.Text.RegularExpressions;

namespace ChatApi.Helpers;

public static partial class MessageSanitizer
{
    public static string SanitizeMessage(string message)
    {
        if (string.IsNullOrEmpty(message))
            return string.Empty;

        message = InvisibleCharacterRegex().Replace(message, string.Empty);
        message = message.Replace("\r\n", "\n");
        message = message.Trim();
        message = ExcessiveNewlinesRegex().Replace(message, "\n\n"); 

        return message;
    }

    public static bool IsValidAfterSanitize(string message)
    {
        var cleaned = SanitizeMessage(message);
        return cleaned.Length is > 0 and <= 65536;
    }

    [GeneratedRegex(@"[\u200B\u00A0]")]
    private static partial Regex InvisibleCharacterRegex();
    [GeneratedRegex(@"\n{3,}")]
    private static partial Regex ExcessiveNewlinesRegex();
}
