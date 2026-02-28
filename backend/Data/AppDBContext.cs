// Microsoft.EntityFrameworkCore namespace for Entity Framework functionality
using Microsoft.EntityFrameworkCore; // Provides DbContext base class and database operations
using WongaFair.Api.Models; // Domain models (User entity)

namespace WongaFair.Api.Data;

// Entity Framework Core database context class
// Acts as a bridge between domain models and the database
// Handles database connections, queries, and data persistence
public class AppDbContext : DbContext
{
    // Constructor accepting database options (connection string, provider, etc.)
    // Options are configured in Program.cs with dependency injection
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // DbSet property representing the Users table in the database
    // Provides LINQ queries and CRUD operations for User entities
    public DbSet<User> Users { get; set; }

    // Override to configure entity relationships, indexes, and constraints
    // Called during model creation to customize database schema
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure unique index on Email field to prevent duplicate email addresses
        // Ensures data integrity by enforcing unique email constraint at database level
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();
    }
}
