using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Domain.Models;

namespace Fitness.Domain.Interfaces
{
    public interface IGoalRepository
    {
        Task<IEnumerable<Goal>> GetAllAsync();
        Task<Goal> GetByIdAsync(int id);
        Task AddAsync(Goal goal);
        Task UpdateAsync(Goal goal);
        Task DeleteAsync(Goal goal);
    }
}
