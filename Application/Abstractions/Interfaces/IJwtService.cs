using System.Security.Claims;
using Fitness.Domain.Models;

namespace Fitness.Application.Abstractions.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(ApplicationUser user, IList<string> roles);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
    Task<RefreshToken> SaveRefreshTokenAsync(string userId, string token);
    Task<RefreshToken?> GetRefreshTokenAsync(string token);
    Task RevokeRefreshTokenAsync(string token);
}
