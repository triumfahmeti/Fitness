using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.FoodDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;


namespace Fitness.Application.Services
{
    public class FoodService : IFoodService
    {
        private readonly IFoodRepository _repo;

        public FoodService(IFoodRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Food>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Food> GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<Food> CreateAsync(CreateEditFoodDto dto)
        {
            var food = new Food
            {
                Name = dto.Name,
                CaloriesPer100g = dto.CaloriesPer100g,
                ProteinPer100g = dto.ProteinPer100g,
                CarbsPer100g = dto.CarbsPer100g,
                FatPer100g = dto.FatPer100g,
                ImageUrl = dto.ImageUrl
            };

            await _repo.AddAsync(food);
            return food;
        }

        public async Task<Food> UpdateAsync(int id, CreateEditFoodDto dto)
        {
            var food = await _repo.GetByIdAsync(id);
            if (food == null)
                throw new Exception("Food not found");

            food.Name = dto.Name;
            food.CaloriesPer100g = dto.CaloriesPer100g;
            food.ProteinPer100g = dto.ProteinPer100g;
            food.CarbsPer100g = dto.CarbsPer100g;
            food.FatPer100g = dto.FatPer100g;
            food.ImageUrl = dto.ImageUrl;

            await _repo.UpdateAsync(food);
            return food;
        }

        public async Task DeleteAsync(int id)
        {
            var food = await _repo.GetByIdAsync(id);
            if (food == null)
                throw new Exception("Food not found");

            await _repo.DeleteAsync(food);
        }
    }
}
