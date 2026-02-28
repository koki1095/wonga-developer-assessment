// ASP.NET Core MVC imports for controller functionality
using Microsoft.AspNetCore.Mvc; // Base controller and action result classes
using Microsoft.EntityFrameworkCore; // Entity Framework async query methods
using Microsoft.IdentityModel.Tokens; // JWT token creation and validation
using System.IdentityModel.Tokens.Jwt; // JWT security token handler
using System.Security.Claims; // Claims-based identity for JWT
using System.Text; // Encoding utilities for JWT
using BCrypt.Net; // Password hashing library
using WongaFair.Api.Data; // Database context
using WongaFair.Api.Models; // Domain models (User entity)
using WongaFair.Api.Models.DTOs; // Data Transfer Objects for API responses
using WongaFair.Api.Configuration; // JWT configuration settings
using Microsoft.Extensions.Options; // Options pattern for configuration binding

namespace WongaFair.Api.Controllers;

[Route("api/[controller]")] // Route attribute defines API endpoint pattern: api/auth
[ApiController] // Marks this as an API controller with automatic model validation
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context; // Database context for data operations
    private readonly JwtSettings _jwtSettings; // JWT configuration settings

    // Constructor with dependency injection
    // AppDbContext injected for database operations
    // IOptions<JwtSettings> injected for JWT configuration
    public AuthController(AppDbContext context, IOptions<JwtSettings> jwtSettings)
    {
        _context = context;
        _jwtSettings = jwtSettings.Value;
    }

    // HTTP POST endpoint for user registration
    // Route: POST api/auth/register
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
    {
        // Check if user already exists by email to prevent duplicates
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == registerDto.Email);

        if (existingUser != null)
        {
            return BadRequest(new { message = "User with this email already exists" });
        }

        // Create new user entity with hashed password for security
        var user = new User
        {
            Id = Guid.NewGuid(), // Generate unique identifier
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password) // Hash password using BCrypt
        };

        // Add user to database and save changes
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generate JWT token for immediate authentication after registration
        var token = GenerateJwtToken(user);

        // Create response DTO with token and user information
        var response = new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            }
        };

        return Ok(response); // Return 200 OK with authentication response
    }

    // HTTP POST endpoint for user login
    // Route: POST api/auth/login
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
    {
        // Find user by email address
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);

        if (user == null)
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Verify password by comparing hash
        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        // Generate JWT token for authenticated user
        var token = GenerateJwtToken(user);

        // Create response DTO with token and user information
        var response = new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email
            }
        };

        return Ok(response); // Return 200 OK with authentication response
    }

    // Private helper method to generate JWT tokens
    // Contains user claims and is signed with secret key
    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler(); // Handler for creating and writing JWT tokens
        var key = Encoding.ASCII.GetBytes(_jwtSettings.Secret); // Convert secret to byte array

        // Create claims list containing user information
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()), // Subject claim (user ID)
            new Claim(JwtRegisteredClaimNames.Email, user.Email), // Email claim
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique token ID (prevents replay attacks)
            new Claim("firstName", user.FirstName), // Custom claim for first name
            new Claim("lastName", user.LastName) // Custom claim for last name
        };

        // Configure token descriptor with claims, expiration, and signing credentials
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims), // Set claims identity
            Expires = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes), // Set expiration time
            Issuer = _jwtSettings.Issuer, // Set token issuer
            Audience = _jwtSettings.Audience, // Set token audience
            SigningCredentials = new SigningCredentials( // Configure signing credentials
                new SymmetricSecurityKey(key), // Use symmetric key
                SecurityAlgorithms.HmacSha256Signature) // Use HMAC SHA256 algorithm
        };

        // Create and write the JWT token
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token); // Return serialized token string
    }
}
