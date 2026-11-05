using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ClickRepository : Repository<Click>, IClickRepository
{
    public ClickRepository(ApplicationDbContext dbContext) : base(dbContext) {}

    public async Task<int> GetClicksCountAsync(string urlId, CancellationToken ct)
    {
       return await Db.Clicks.Where(x => x.UrlId == urlId ).CountAsync(ct);
    }
}
