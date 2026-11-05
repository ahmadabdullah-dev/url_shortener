using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UrlRepository : Repository<Url>, IUrlRepository
{
    public UrlRepository(ApplicationDbContext dbContext) : base(dbContext) {}
    public async Task<bool> IsUrlShortCodeExistsAsync(string shortCode, CancellationToken ct)
    {
        return await Db.Urls.AnyAsync
            (u => u.ShortCode == shortCode, ct);
    }
    public async Task<Url?> GetUrlByUrlShortCodeAsync(string shortCode, CancellationToken ct)
    {
        return await Db.Urls.SingleOrDefaultAsync(u => u.ShortCode == shortCode, ct);
    }
    public async Task<PagedList<Url>> GetUrlsByUserIdAsync(PaginationParams p, string userId, CancellationToken ct)
    {
        var query = Db.Urls
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .Select(x => new Url
            {
                Id = x.Id,
                ShortCode = x.ShortCode,
                LongUrl = x.LongUrl,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt,
                ExpiresAt = x.ExpiresAt,
                Cliks = x.Cliks
            });

        return await PagedList<Url>.CreateAsync(query, p.Page, p.PageSize);
    }

    public async Task<(string UrlId, string LongUrl)?> GetUrlIdAndLongUrlByShortCodeAsync(string shortCode, CancellationToken ct)
    {
        var result = await Db.Urls
            .Where(x => x.ShortCode == shortCode)
            .Select(x => new { x.Id, x.LongUrl })
            .SingleOrDefaultAsync(ct);

        return result == null ? null : (result.Id, result.LongUrl);
    }
}
