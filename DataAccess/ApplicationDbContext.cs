using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class ApplicationDbContext(DbContextOptions options) : IdentityDbContext<AppUser, IdentityRole,string>(options)
{
    public DbSet<Url> Urls { get; set; }
    public DbSet<Click> Clicks { get; set; }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<AppUser>(entity =>
        {
            entity.Property(u => u.FirstName).IsRequired();
            entity.Property(u => u.LastName).IsRequired();
        });

        builder.Entity<Url>()
          .HasIndex(u => u.ShortCode)
          .IsUnique();

        builder.Entity<Url>()
          .HasOne(u => u.User)
          .WithMany(usr => usr.Urls)
          .HasForeignKey(u => u.UserId)
          .OnDelete(DeleteBehavior.SetNull);

        builder.Entity<Click>()
            .HasOne(c => c.Url)
            .WithMany(u => u.Cliks)
            .HasForeignKey(c => c.UrlId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
