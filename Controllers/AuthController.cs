using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace CafeOrderSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        // Simple credential validation (you can swap with DB lookup later)
        // Hardcoded for demo/admin: admin / admin123
        if (request.Username == "admin" && request.Password == "admin123")
        {
            var token = GenerateJwtToken(request.Username, request.TenantId ?? "demo-cafe", "Admin");
            return Ok(new LoginResponse
            {
                Token = token,
                Username = request.Username,
                TenantId = request.TenantId ?? "demo-cafe",
                Role = "Admin"
            });
        }

        return Unauthorized(new { message = "Invalid username or password" });
    }

    private string GenerateJwtToken(string username, string tenantId, string role)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role),
            new Claim("tenantId", tenantId),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["DurationInMinutes"]!)),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? TenantId { get; set; }
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string TenantId { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}