namespace Application.Services;

public class ClickService : IClickService
{
    private readonly IClickRepository _clickRepository;
    public ClickService(IClickRepository clickRepository)
    {
        _clickRepository = clickRepository;
    }
    public async Task AddClickAsync(string urlId, CancellationToken ct)
    {
        var click = new Click
        {
            UrlId = urlId,
            ClickedAt = DateTime.UtcNow,
        };

        await _clickRepository.AddAsync(click, ct);
    }
    public async Task<int> GetClicksCountAsync(string urlId, CancellationToken ct)
    {
      return await _clickRepository.GetClicksCountAsync(urlId, ct);
    }
}
