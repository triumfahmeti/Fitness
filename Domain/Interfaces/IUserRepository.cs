using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Models;
using Microsoft.AspNetCore.Identity;

namespace Fitness.Domain.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<ApplicationUser>> GetAllAsync();
        Task<ApplicationUser> GetByIdAsync(string id);
        Task<IdentityResult> AddAsync(ApplicationUser user, string password);
        Task UpdateAsync(ApplicationUser user);
        Task<bool> DeleteAsync(string id);
    }
}