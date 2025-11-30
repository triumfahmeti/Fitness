using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Domain.Models;

namespace Fitness.Domain.Interfaces
{
    public interface IProgressRepository
    {
        Task<IEnumerable<Progress>> GetAllAsync();
        Task<Progress> GetByIdAsync(int id);
        Task AddAsync(Progress progress);
        Task UpdateAsync(Progress progress);
        Task DeleteAsync(Progress progress);
    }
}
