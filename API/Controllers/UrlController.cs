using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ConfirmedEmail]
public class UrlController : BaseApiController
{
    private readonly IUrlService _urlService;
    public UrlController(IUrlService urlService)
    {
        _urlService = urlService;
    }
    [Authorize]
    [HttpPost("create-url-short-code")]
    public async Task<IActionResult> CreateUrlShortCodeAsync(CreateUrlShortCodeDto dto, CancellationToken ct)
    {
        var result = await _urlService.CreateUrlShortCodeAsync(dto, ct);
        return HandleResult(result);
    }
    [Authorize]
    [SkipConfirmedEmail]
    [HttpGet("short-code")]
    public async Task<IActionResult> GetUrlByUrlShortCode(string shortCode, CancellationToken ct)
    {
        var result = await _urlService.GetUrlByUrlShortCodeAsync(shortCode, ct);
        return HandleResult(result);
    }
    [Authorize]
    [HttpGet("current-user-urls")]
    public async Task<IActionResult> GetCurrentUserUrls([FromQuery] PaginationParams p, CancellationToken ct)
    {
        var result = await _urlService.GetCurrentUserUrlsAsync(p, ct);
        return HandleResult(result);
    }
    [SkipConfirmedEmail]
    [HttpGet("redirect-by-short-code")]
    public async Task<IActionResult> RedirectFromRouteAsync(string shortCode, CancellationToken ct)
    { 
        var result = await _urlService.RedirectFromRouteAsync(shortCode, ct);
        return HandleResult(result);
    }
}
