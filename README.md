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

### FileService
- `UploadImage(IFormFile file)`
- `UploadRawFile(IFormFile file)`
- `Upload(IFormFile? file, RawUploadParams uploadParams, string folder)`
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
## How to Run

### 1. Configure `appsettings.json`

Update the configuration in your API project's `appsettings.json` file.

```json
{
  "ConnectionStrings": {
    "DefaultConnection": ""
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "EmailConfiguration": {
    "From": "",
    "SmtpServer": "smtp.gmail.com",
    "Port": 465,
    "UserName": "",
    "Password": "",
    "EnableSsl": true
  },
 "CloudinaryConfigurations": {
   "CloudName": "",
   "ApiKey": "",
   "ApiSecret": ""
 },
  "AllowedHosts": "*"
}
 ```

### 2. Apply Database Migrations

Run the following commands from the **solution root directory**.

**Add a migration** (only if no migrations exist):

```powershell
dotnet ef migrations add Mig_1 --project .\Infrastructure\Infrastructure.csproj --startup-project .\API\API.csproj
```

**Update the database:**

```powershell
dotnet ef database update --project .\Infrastructure\Infrastructure.csproj --startup-project .\API\API.csproj
```

### 3. Run the API

Run the API project using Visual Studio or the .NET CLI.

### 4. Install Frontend Dependencies

Navigate to the `WEB` directory and install the dependencies:

```bash
cd WEB
npm install
```

### 5. Run the Frontend

Start the development server:

```bash
npm run dev
```

The frontend will be available at **https://localhost:3000**.

