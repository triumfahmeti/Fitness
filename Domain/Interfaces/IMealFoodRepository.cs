using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Models;


namespace Fitness.Domain.Interfaces
{
    public interface IMealFoodRepository
    {
        Task<IEnumerable<MealFood>> GetAllAsync();
        Task<MealFood?> GetByIdAsync(int mealId, int foodId);
        Task AddAsync(MealFood mealFood);
        Task UpdateAsync(MealFood mealFood);
        Task DeleteAsync(MealFood mealFood);
    }
}
