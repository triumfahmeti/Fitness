using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Dtos.MealFoodDtos;
using Fitness.Domain.Models;

namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IMealFoodService
    {
        Task<IEnumerable<MealFood>> GetAllAsync();
        Task<MealFood?> GetByIdAsync(int mealId, int foodId);
        Task<MealFood> CreateAsync(CreateEditMealFoodDto dto);
        Task<MealFood> UpdateAsync(int mealId, int foodId, CreateEditMealFoodDto dto);
        Task DeleteAsync(int mealId, int foodId);
    }
}
