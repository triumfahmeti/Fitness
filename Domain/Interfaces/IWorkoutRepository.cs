using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Models;

namespace Fitness.Domain.Interfaces
{
    public interface IWorkoutRepository
    {
        Task<IEnumerable<Workout>> GetAllAsync();
        Task<Workout> GetByIdAsync(int id);
        Task AddAsync(Workout workout);
        Task UpdateAsync(Workout workout);
        Task DeleteAsync(Workout workout);
    }
}