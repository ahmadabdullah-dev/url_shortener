using Microsoft.Extensions.Logging;

namespace Application.Services;
public class UrlService : IUrlService
{
    private readonly IUrlRepository _urlRepository;
    private readonly IUserService _userService;
    private readonly IClickService _clickService;
    private ILogger<UrlService> _logger;

    public UrlService(IUrlRepository urlRepository,
        IUserService userService,
        IClickService clickService,
        ILogger<UrlService> logger
        )
    {
        _urlRepository = urlRepository;
        _userService = userService;
        _clickService = clickService;
        _logger = logger;
    }
    public async Task<Result<string>> CreateUrlShortCodeAsync(CreateUrlShortCodeDto dto, CancellationToken ct)
    {
        var currentUser = await _userService.GetCurrentUserAsync(ct);

        if (currentUser.Value == null)
            return Result<string>.Failure("Unauthorized", 401);

        if (!currentUser.Value.IsEmailConfirmed)
            return Result<string>.Failure("Please confirm your email", 403);

        if (!ServiceHelper.IsUrl(dto.LongUrl))
            return Result<string>.Failure("Invalid URL", 400);

        string shortCode;

        if (!string.IsNullOrEmpty(dto.CustomShortCode))
        {
            if (await _urlRepository.IsUrlShortCodeExistsAsync(dto.CustomShortCode, ct))
                return Result<string>.Failure($"'{dto.CustomShortCode}': Short code already exists", 409);

            shortCode = dto.CustomShortCode;
        }
        else
        {
            shortCode = await GenerateUniqueUrlShortCodeAsync(ct);
        }

        var url = new Url
        {
            ShortCode = shortCode,
            LongUrl = dto.LongUrl,
            UserId = currentUser.Value.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = dto.ExpiresAt ?? DateTime.UtcNow.AddDays(14),
            IsActive = true
        };

        try
        {
            await _urlRepository.AddAsync(url, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create short code for {LongUrl}", dto.LongUrl);
            return Result<string>.Failure("An error occurred while creating the short code. Please try again later.", 500);
        }

        return Result<string>.Success(shortCode);
    }
    public async Task<Result<UrlDto>> GetUrlByUrlShortCodeAsync(string shortCode, CancellationToken ct)
    {
        var currentUser = await _userService.GetCurrentUserAsync(ct);
        
        if (currentUser.Value == null)
            return Result<UrlDto>.Failure("Unauthorized", 401);

        if (!currentUser.Value.IsEmailConfirmed)
            return Result<UrlDto>.Failure("Please confirm your email",401);

        var entity = await _urlRepository.GetUrlByUrlShortCodeAsync(shortCode, ct);

        if (entity == null)
            return Result<UrlDto>.Failure("Url not found", 404);

        int clicksCount = await _clickService.GetClicksCountAsync(entity.Id, ct);

        var dto = new UrlDto
        {
            LongUrl = entity.LongUrl,
            ShortCode = entity.ShortCode,
            CreatedAt = entity.CreatedAt,
            IsActive = entity.IsActive,
            ExpiresAt = entity.ExpiresAt,
        };
        
        return Result<UrlDto>.Success(dto);
    }
    public async Task<Result<PagedList<UrlDto>>> GetCurrentUserUrlsAsync(PaginationParams p, CancellationToken ct)
    {
        var userId = _userService.GetCurrentUserId();
        
        if (userId == null)
            return Result<PagedList<UrlDto>>.Failure("Unauthorized", 401);

        var urls = await _urlRepository.GetUrlsByUserIdAsync(p, userId, ct);
        
        var dtos = new PagedList<UrlDto>
        {
            Items = urls.Items.Select(x => new UrlDto
            {
                ShortCode = x.ShortCode,
                LongUrl = x.LongUrl,
                IsActive = x.IsActive,
                CreatedAt = x.CreatedAt,
                ExpiresAt = x.ExpiresAt,
                ClickCount = x.Cliks.Count()

            }).ToList(),

            CurrentPage = urls.CurrentPage,
            TotalCount = urls.TotalCount,
            TotalPages = urls.TotalPages

        };
       return Result<PagedList<UrlDto>>.Success(dtos);   
    }
    public async Task<Result<string>> RedirectFromRouteAsync(string shortCode, CancellationToken ct)
    {
        var result = await _urlRepository.GetUrlIdAndLongUrlByShortCodeAsync(shortCode, ct);

        if (result == null)
            return Result<string>.Failure("Url not found", 404);

        var (urlId, longUrl) = result.Value;

        try
        {
            await _clickService.AddClickAsync(urlId, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to record click for {shortCode}");
        }

        return Result<string>.Success(longUrl);
    }
    private async Task<string> GenerateUniqueUrlShortCodeAsync(CancellationToken ct)
    {
        for (int attempted = 0; attempted < 5; attempted++)
        {
            var code = ServiceHelper.GenerateShortCode(5);

            if (!await _urlRepository.IsUrlShortCodeExistsAsync(code, ct))
                return code;

        }
        throw new InvalidOperationException("Could not generate a unique short code. Try again.");
    }
}
