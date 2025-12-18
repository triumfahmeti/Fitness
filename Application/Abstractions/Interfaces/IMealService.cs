using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Dtos.MealDtos;
using Fitness.Domain.Models;
namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IMealService
    {
        Task<IEnumerable<MealResponseDto>> GetAllAsync();
        Task<IEnumerable<MealResponseDto>> GetByClientIdAsync(int clientId);

        Task<Meal?> GetByIdAsync(int id);
        Task<Meal> CreateAsync(CreateEditMealDto dto);
        Task<Meal> UpdateAsync(int id, CreateEditMealDto dto);
        Task DeleteAsync(int id);
    }
}
