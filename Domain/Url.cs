namespace Domain;

public class Url : BaseEntity
{
    public string ShortCode { get; set; } = null!;
    public string LongUrl { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
    public bool IsActive { get; set; }

    public AppUser User { get; set; } = null!;
    public ICollection<Click> Cliks { get; set; } = new List<Click>(); 
}
