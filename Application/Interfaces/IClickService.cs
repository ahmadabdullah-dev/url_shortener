namespace Application.Interfaces;
public interface IClickService
{
    Task AddClickAsync(string urlId, CancellationToken ct);
    Task<int> GetClicksCountAsync(string urlId, CancellationToken ct);
}
