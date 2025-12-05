using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Dtos.FoodDtos;
using Fitness.Domain.Models;


namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IFoodService
    {
        Task<IEnumerable<Food>> GetAllAsync();
        Task<Food> GetByIdAsync(int id);
        Task<Food> CreateAsync(CreateEditFoodDto dto);
        Task<Food> UpdateAsync(int id, CreateEditFoodDto dto);
        Task DeleteAsync(int id);
    }
}
