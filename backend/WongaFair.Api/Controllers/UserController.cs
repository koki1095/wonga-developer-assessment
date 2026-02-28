// ASP.NET Core authorization and MVC imports
using Microsoft.AspNetCore.Authorization; // Authorization attributes and middleware
using Microsoft.AspNetCore.Mvc; // MVC controller base classes and action results
using Microsoft.EntityFrameworkCore; // Entity Framework async database operations
using System.Security.Claims; // Claims-based identity for user information
using System.IdentityModel.Tokens.Jwt; // JWT registered claim names
using WongaFair.Api.Data; // Database context
using WongaFair.Api.Models.DTOs; // Data Transfer Objects

namespace WongaFair.Api.Controllers;

[Route("api/[controller]")] // Route attribute defines API endpoint pattern: api/user
[ApiController] // Marks this as an API controller with automatic model validation
[Authorize] // Requires authentication for all endpoints in this controller
public class UserController : ControllerBase
{
    private readonly AppDbContext _context; // Database context for user data operations

    // Constructor with dependency injection
    // AppDbContext injected for database operations
    public UserController(AppDbContext context)
    {
        _context = context;
    }

    // HTTP GET endpoint to retrieve current authenticated user's profile
    // Route: GET api/user/me
    // Requires authentication due to [Authorize] attribute
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        // Extract user ID from JWT token claims
        // Try standard NameIdentifier claim first, then fall back to Subject claim
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        // Validate that user ID claim exists and can be parsed as GUID
        if (userIdClaim == null || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(); // Return 401 if user ID cannot be determined
        }

        // Query database for user by ID
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return NotFound(); // Return 404 if user not found in database
        }

        // Return user data as DTO (without sensitive information like password hash)
        return Ok(new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email
        });
    }
}
