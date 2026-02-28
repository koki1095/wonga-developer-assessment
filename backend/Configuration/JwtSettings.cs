namespace WongaFair.Api.Configuration;

// Configuration class for JWT (JSON Web Token) settings
// Properties are bound from appsettings.json configuration file
// Used by dependency injection to provide JWT configuration throughout the application
public class JwtSettings
{
    public string Secret { get; set; } = string.Empty; // Secret key used to sign JWT tokens (should be strong and kept secure)
    public string Issuer { get; set; } = string.Empty; // Token issuer (typically the application name or domain)
    public string Audience { get; set; } = string.Empty; // Intended audience for the token (who the token is for)
    public int ExpirationInMinutes { get; set; } // Token expiration time in minutes (how long the token is valid)
}
