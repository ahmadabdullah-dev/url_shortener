namespace Infrastructure.Interfaces;
public interface IClickRepository : IRepository<Click>
{
    Task<int> GetClicksCountAsync(string urlId, CancellationToken ct);
}
