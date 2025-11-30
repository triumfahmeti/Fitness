using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Models;


namespace Fitness.Domain.Interfaces
{
    public interface IMealRepository
    {
        Task<IEnumerable<Meal>> GetAllAsync();
        Task<Meal?> GetByIdAsync(int id);
        Task AddAsync(Meal meal);
        Task UpdateAsync(Meal meal);
        Task DeleteAsync(Meal meal);
    }
}
