// System.ComponentModel.DataAnnotations namespace for validation attributes
using System.ComponentModel.DataAnnotations; // Provides validation attributes like [Required], [EmailAddress], etc.

namespace WongaFair.Api.Models.DTOs;

// Data Transfer Object for user registration requests
// Contains validation attributes to ensure data integrity before processing
// Used by the AuthController.Register endpoint
public class RegisterDto
{
    [Required] // Validation: This field is mandatory
    public string FirstName { get; set; } = string.Empty; // User's first name (required for registration)

    [Required] // Validation: This field is mandatory
    public string LastName { get; set; } = string.Empty; // User's last name (required for registration)

    [Required] // Validation: This field is mandatory
    [EmailAddress] // Validation: Must be a valid email address format
    public string Email { get; set; } = string.Empty; // User's email address (used as username and for communication)

    [Required] // Validation: This field is mandatory
    [MinLength(6)] // Validation: Minimum password length of 6 characters
    public string Password { get; set; } = string.Empty; // Plain text password (will be hashed before storage)
}
