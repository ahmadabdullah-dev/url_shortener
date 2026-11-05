namespace Application.Interfaces;

public interface IUrlService
{
    Task<Result<string>> CreateUrlShortCodeAsync(CreateUrlShortCodeDto dto, CancellationToken ct);
    Task<Result<UrlDto>> GetUrlByUrlShortCodeAsync(string shortCode, CancellationToken ct);
    Task<Result<PagedList<UrlDto>>> GetCurrentUserUrlsAsync(PaginationParams p, CancellationToken ct);
    Task<Result<string>> RedirectFromRouteAsync(string shortCode, CancellationToken ct);
}
