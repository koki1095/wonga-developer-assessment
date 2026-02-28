// System namespace for basic .NET types
using System; // Provides Guid and DateTime types

namespace WongaFair.Api.Models;

// Domain entity representing a user in the system
// This class maps to the Users table in the database via Entity Framework
public class User
{
    public Guid Id { get; set; } // Primary key - unique identifier for each user (GUID)
    public string FirstName { get; set; } = string.Empty; // User's first name (initialized to empty string to avoid nulls)
    public string LastName { get; set; } = string.Empty; // User's last name (initialized to empty string to avoid nulls)
    public string Email { get; set; } = string.Empty; // User's email address - used for login and communication (initialized to empty string to avoid nulls)
    public string PasswordHash { get; set; } = string.Empty; // BCrypt hashed password for security (never store plain text passwords)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Timestamp when user account was created (defaults to current UTC time)
}
