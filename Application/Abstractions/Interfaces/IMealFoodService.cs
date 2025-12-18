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
        Task<IEnumerable<MealFoodResponseDto>> GetAllAsync();
        Task<MealFoodResponseDto?> GetByIdAsync(int mealId, int foodId);
        Task<MealFoodResponseDto> CreateAsync(CreateEditMealFoodDto dto);
        Task<MealFoodResponseDto> UpdateAsync(int mealId, int foodId, CreateEditMealFoodDto dto);
        Task DeleteAsync(int mealId, int foodId);
        Task<IEnumerable<MealFoodResponseDto>> GetByMealIdAsync(int mealId);

    }
}
