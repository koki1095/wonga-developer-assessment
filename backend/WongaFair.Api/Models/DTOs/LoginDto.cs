// System.ComponentModel.DataAnnotations namespace for validation attributes
using System.ComponentModel.DataAnnotations; // Provides validation attributes like [Required], [EmailAddress], etc.

namespace WongaFair.Api.Models.DTOs;

// Data Transfer Object for user login requests
// Contains validation attributes to ensure data integrity before processing
// Used by the AuthController.Login endpoint
public class LoginDto
{
    [Required] // Validation: This field is mandatory
    [EmailAddress] // Validation: Must be a valid email address format
    public string Email { get; set; } = string.Empty; // User's email address (used as username for authentication)

    [Required] // Validation: This field is mandatory
    public string Password { get; set; } = string.Empty; // Plain text password (will be verified against stored hash)
}
