namespace Infrastructure.Projections;
public class UrlProjection
{
    public string UrlId { get; set; } = null!;
    public string ShortCode { get; set; } = null!;
    public string LongUrl { get; set; } = null!;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; } 
    public DateTime ExpiresAt { get; set; }
    public int ClickCount { get; set; } = 0;
}
