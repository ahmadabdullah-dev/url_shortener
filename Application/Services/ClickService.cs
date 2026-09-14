namespace Application.Services;

public class ClickService : IClickService
{
    private readonly IClickRepository _clickRepository;
    public ClickService(IClickRepository clickRepository)
    {
        _clickRepository = clickRepository;
    }
    public async Task AddClickAsync(string urlId)
    {
        var click = new Click
        {
            UrlId = urlId,
            ClickedAt = DateTime.UtcNow,
        };

        await _clickRepository.AddAsync(click);
    }
    public async Task<int> GetClicksCountAsync(string urlId)
    {
      return await _clickRepository.GetClicksCountAsync(urlId);
    }
}
