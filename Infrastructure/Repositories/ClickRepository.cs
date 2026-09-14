using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ClickRepository : IClickRepository
{
    private readonly ApplicationDbContext _dbContext;
    public ClickRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public async Task AddAsync(Click click)
    {
        await _dbContext.Clicks.AddAsync(click);
        await _dbContext.SaveChangesAsync();
    }
    public async Task<int> GetClicksCountAsync(string urlId)
    {
       return await _dbContext.Clicks.Where(x => x.UrlId == urlId ).CountAsync();
    }
}
