using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUrlService, UrlService>();
        services.AddScoped<IClickService, ClickService>();

        services.Configure<EmailConfiguration>(configuration.GetSection("EmailConfiguration"));

        return services;
    }
}
