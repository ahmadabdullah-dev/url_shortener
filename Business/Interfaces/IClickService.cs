namespace Application.Interfaces;
public interface IClickService
{
    Task AddClickAsync(string urlId);
    Task<int> GetClicksCountAsync(string urlId);
}
