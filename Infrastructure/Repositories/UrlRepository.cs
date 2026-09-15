using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class UrlRepository : IUrlRepository
{
    private readonly ApplicationDbContext _dbContext;
    public UrlRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task<string> AddAsync(Url url)
    {
        _dbContext.Urls.Add(url);
        await _dbContext.SaveChangesAsync();
        return url.Id;
    }
    public async Task<bool> IsUrlShortCodeExistsAsync(string shortCode)
    {
        return await _dbContext.Urls.AnyAsync
            (u => u.ShortCode == shortCode);
    }
    public async Task<Url?> GetUrlByUrlShortCodeAsync(string shortCode)
    {
        return await _dbContext.Urls.SingleOrDefaultAsync(u => u.ShortCode == shortCode);
    }
    public async Task<PagedList<Url>> GetUrlsByUserIdAsync(PaginationParams p, string userId)
    {
        var query = _dbContext.Urls
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

    public async Task<(string UrlId, string LongUrl)?> GetUrlIdAndLongUrlByShortCodeAsync(string shortCode)
    {
        var result = await _dbContext.Urls
            .Where(x => x.ShortCode == shortCode)
            .Select(x => new { x.Id, x.LongUrl })
            .SingleOrDefaultAsync();

        return result == null ? null : (result.Id, result.LongUrl);
    }
}
