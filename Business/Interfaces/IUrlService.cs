namespace Application.Interfaces;

public interface IUrlService
{
    Task<Result<string>> CreateUrlShortCodeAsync(CreateUrlShortCodeDto dto);
    Task<Result<UrlDto>> GetUrlByUrlShortCodeAsync(string shortCode);
    Task<Result<PagedList<UrlDto>>> GetCurrentUserUrlsAsync(PaginationParams p);
    Task<Result<string>> RedirectFromRouteAsync(string shortCode);
}
