using Microsoft.AspNetCore.Identity;
using System.Security.Cryptography;

namespace Application.Services;

public static class ServiceHelper
{
    public static string GetFirstError(IdentityResult result) =>
        result.Errors.FirstOrDefault()?.Description ?? "Unexpected error happened";
    public static bool IsUrl(string s)
    {
        return Uri.TryCreate(s, UriKind.Absolute, out Uri? uriResult)
            && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
    public static string GenerateShortCode(int codeLength)
    {
        string Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        var chars = new char[codeLength];

        for (int i = 0; i < chars.Length; i++)
        {
            chars[i] = Alphabet[RandomNumberGenerator.GetInt32(Alphabet.Length)];
        }
        return new string(chars);
    }
}
