// System namespace for basic .NET types
using System; // Provides Guid type

namespace WongaFair.Api.Models.DTOs;

// Data Transfer Object for user information responses
// Contains only safe, non-sensitive user data (excludes password hash)
// Used for API responses to return user profile information
public class UserDto
{
    public Guid Id { get; set; } // Unique identifier for the user
    public string FirstName { get; set; } = string.Empty; // User's first name
    public string LastName { get; set; } = string.Empty; // User's last name
    public string Email { get; set; } = string.Empty; // User's email address
}
