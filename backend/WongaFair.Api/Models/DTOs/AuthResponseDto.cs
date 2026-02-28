namespace WongaFair.Api.Models.DTOs;

// Data Transfer Object for authentication response
// Contains JWT token and user information returned after successful login/registration
// Used by AuthController endpoints for authentication responses
public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty; // JWT access token for subsequent API calls
    public UserDto User { get; set; } = new(); // User profile information (safe data only)
}
