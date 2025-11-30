using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Domain.Models;

namespace Fitness.Domain.Interfaces
{
    public interface IAdminRepository
    {
        Task<IEnumerable<Admin>> GetAllAsync();
        Task<Admin> GetByIdAsync(int id);
        Task AddAsync(Admin admin);
        Task UpdateAsync(Admin admin);
        Task DeleteAsync(Admin admin);
    }
}
