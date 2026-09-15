# Url Shortener

## API Features

### Auth
- `LoginAsync(LoginDto dto)`
- `LogoutAsync()`
- `RegisterAsync(RegisterDto)`
- `ConfirmEmailAsync(string code)`
- `ResendEmailConfirmationCodeAsync()`
- `ForgetPasswordAsync(string email)`
- `ResetPasswordAsync(ResetPasswordDto dto)`

### Common
- `Result<T> Pattern`
- `PagedList`

### Url 
- `CreateUrlShortCodeAsync(CreateUrlShortCodeDto dto)`
- `GetUrlByUrlShortCodeAsync(string shortCode)`
- `GeCurrentUserUrls(PaginationParams)`
- `RedirectFromRouteAsync(string shortCode)`

### User 
- `GetCurrentUserAsync()`

### Data
- `DataSeeder`

### Click
- `AddClickAsync(string urlId)`
- `GetClicksCountAsync(string urlId)`
---
## Web Features

### Auth
- `RequireAuth()`
- `LoginForm()`
- `LogoutButton()`
- `RequireConfirmedEmail()`
- `ConfirmEmailForm()`
- `ForgetPasswordForm()`
- `ResetPasswordForm()`

### App
- `Header`
- `TemporaryDrawer`
- `Footer`
- `Dashboard`
- `Router`

### Url
- `CreateUrlShortCodeForm()`
- `ReadUrlByShortCodeForm()`
- `RedirectToOriginalUrl()`
- `CurrentUserUrls()`

### Error
- `NotFound`
- `ErrorPage`
---
## Run Database Migrations

Run these commands from the **solution root**.

**Add a migration:**

```powershell
dotnet ef migrations add Mig_1 --project .\Infrastructure\Infrastructure.csproj --startup-project .\API\API.csproj
```

**Apply migrations:**

```powershell
dotnet ef database update --project .\Infrastructure\Infrastructure.csproj --startup-project .\API\API.csproj
```
