namespace Infrastructure.Interfaces;

public interface IUrlRepository
{
    Task<string> AddAsync(Url url);
    Task<bool> IsUrlShortCodeExistsAsync(string shortCode);
    Task<Url?> GetUrlByUrlShortCodeAsync(string shortCode);
    Task<PagedList<UrlProjection>> GetUrlsByUserIdAsync(PaginationParams p, string userId);
    Task<(string UrlId, string LongUrl)?> GetUrlIdAndLongUrlByShortCodeAsync(string shortCode);
}
