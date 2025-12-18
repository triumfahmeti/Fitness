using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Fitness.Domain.Models;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.AuthDtos;
using System.Security.Claims;
using Fitness.Data;
using Microsoft.AspNetCore.Authorization;

namespace Fitness.Presentation.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtService _jwtService;
    private readonly IConfiguration _configuration;
    private readonly FitnessDbContext _db;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtService jwtService,
        IConfiguration configuration,
        FitnessDbContext db)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtService = jwtService;
        _configuration = configuration;
        _db = db;
    }

    [AllowAnonymous]
    [HttpPost("register")]
public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
{
    var existingUser = await _userManager.FindByEmailAsync(request.Email);
    if (existingUser != null)
        return BadRequest(new { message = "User with this email already exists" });

    var user = new ApplicationUser
    {
        Email = request.Email,
        // Auto-assign username to email so frontend doesn't need it
        UserName = request.Email,
        Name = request.Name,
        Surname = request.Surname,
        Birthday = request.Birthday,
        Gender = request.Gender,
        EmailConfirmed = true
    };

    var result = await _userManager.CreateAsync(user, request.Password);
    if (!result.Succeeded)
        return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

    var roleResult = await _userManager.AddToRoleAsync(user, request.Role);
    if (!roleResult.Succeeded)
        return BadRequest(new { errors = roleResult.Errors.Select(e => e.Description) });

    if (string.Equals(request.Role, "Admin", StringComparison.OrdinalIgnoreCase))
    {
        _db.Admins.Add(new Admin { UserId = user.Id });
        await _db.SaveChangesAsync();
    }
    else if (string.Equals(request.Role, "Client", StringComparison.OrdinalIgnoreCase))
    {
        _db.Clients.Add(new Client { UserId = user.Id });
        await _db.SaveChangesAsync();
    }

    var roles = await _userManager.GetRolesAsync(user);
    var accessToken = _jwtService.GenerateAccessToken(user, roles);
    var refreshToken = _jwtService.GenerateRefreshToken();
    await _jwtService.SaveRefreshTokenAsync(user.Id, refreshToken);

    var jwtSettings = _configuration.GetSection("JwtSettings");
    var expirationMinutes = int.Parse(jwtSettings["AccessTokenExpirationMinutes"]!);

    return Ok(new AuthResponseDto
    {
        AccessToken = accessToken,
        RefreshToken = refreshToken,
        ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
        UserId = user.Id,
        Email = user.Email!,
        UserName = user.UserName!,
        Roles = roles
    });
}


    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) return Unauthorized(new { message = "Invalid credentials" });

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded) return Unauthorized(new { message = "Invalid credentials" });

        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtService.GenerateAccessToken(user, roles);
        var refreshToken = _jwtService.GenerateRefreshToken();
        await _jwtService.SaveRefreshTokenAsync(user.Id, refreshToken);

        var jwtSettings = _configuration.GetSection("JwtSettings");
        var expirationMinutes = int.Parse(jwtSettings["AccessTokenExpirationMinutes"]!);

        return Ok(new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            Roles = roles
        });
    }

    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
    {
        var principal = _jwtService.GetPrincipalFromExpiredToken(request.AccessToken);
        if (principal == null) return BadRequest(new { message = "Invalid access token" });

        var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return BadRequest(new { message = "Invalid token claims" });

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return BadRequest(new { message = "User not found" });

        var storedRefreshToken = await _jwtService.GetRefreshTokenAsync(request.RefreshToken);
        if (storedRefreshToken == null || !storedRefreshToken.IsActive || storedRefreshToken.UserId != userId)
            return BadRequest(new { message = "Invalid refresh token" });

        await _jwtService.RevokeRefreshTokenAsync(request.RefreshToken);

        var roles = await _userManager.GetRolesAsync(user);
        var newAccessToken = _jwtService.GenerateAccessToken(user, roles);
        var newRefreshToken = _jwtService.GenerateRefreshToken();
        await _jwtService.SaveRefreshTokenAsync(user.Id, newRefreshToken);

        var jwtSettings = _configuration.GetSection("JwtSettings");
        var expirationMinutes = int.Parse(jwtSettings["AccessTokenExpirationMinutes"]!);

        return Ok(new AuthResponseDto
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            UserId = user.Id,
            Email = user.Email!,
            UserName = user.UserName!,
            Roles = roles
        });
    }

    [Authorize]
    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken([FromBody] string refreshToken)
    {
        await _jwtService.RevokeRefreshTokenAsync(refreshToken);
        return Ok(new { message = "Token revoked successfully" });
    }
}
