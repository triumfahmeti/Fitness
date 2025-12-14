using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Models;
using Fitness.Application.Dtos.MealFoodDtos;



namespace Fitness.Domain.Interfaces
{
    public interface IMealFoodRepository
    {
        Task<IEnumerable<MealFood>> GetAllAsync();
        Task<MealFood?> GetByIdAsync(int mealId, int foodId);
        Task AddAsync(MealFood mealFood);
        Task UpdateAsync(MealFood mealFood);
        Task DeleteAsync(MealFood mealFood);
        Task<IEnumerable<MealFoodResponseDto>> GetByMealIdAsync(int mealId);
        Task<IEnumerable<MealFood>> GetByMealIdRawAsync(int mealId);
        Task<Meal?> GetMealByIdAsync(int mealId);
        Task SaveChangesAsync();
        Task RecalculateMealTotalsAsync(int mealId);


    }
}
