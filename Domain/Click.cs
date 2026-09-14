namespace Domain;
public class Click : BaseEntity
{
    public string UrlId { get; set; } = null!;
    public DateTime ClickedAt { get; set; }
    public Url Url { get; set; } = null!;
}