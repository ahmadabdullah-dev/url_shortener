namespace Infrastructure.Interfaces;

public interface IUrlRepository : IRepository<Url>  
{
    Task<bool> IsUrlShortCodeExistsAsync(string shortCode, CancellationToken ct);
    Task<Url?> GetUrlByUrlShortCodeAsync(string shortCode, CancellationToken ct);
    Task<PagedList<Url>> GetUrlsByUserIdAsync(PaginationParams p, string userId, CancellationToken ct);
    Task<(string UrlId, string LongUrl)?> GetUrlIdAndLongUrlByShortCodeAsync(string shortCode, CancellationToken ct);
}
