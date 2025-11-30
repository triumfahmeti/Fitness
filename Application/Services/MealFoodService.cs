using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.MealFoodDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;

namespace Fitness.Application.Services
{
    public class MealFoodService : IMealFoodService
    {
        private readonly IMealFoodRepository _repo;

        public MealFoodService(IMealFoodRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<MealFood>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<MealFood?> GetByIdAsync(int mealId, int foodId)
        {
            return await _repo.GetByIdAsync(mealId, foodId);
        }

        public async Task<MealFood> CreateAsync(CreateEditMealFoodDto dto)
        {
            var mf = new MealFood
            {
                MealId = dto.MealId,
                FoodId = dto.FoodId,
                QuantityGrams = dto.QuantityGrams,
                Calories = dto.Calories,
                Proteins = dto.Proteins,
                Carbs = dto.Carbs,
                Fats = dto.Fats
            };

            await _repo.AddAsync(mf);
            return mf;
        }

        public async Task<MealFood> UpdateAsync(int mealId, int foodId, CreateEditMealFoodDto dto)
        {
            var mf = await _repo.GetByIdAsync(mealId, foodId);
            if (mf == null)
                throw new Exception("MealFood not found");

            mf.QuantityGrams = dto.QuantityGrams;
            mf.Calories = dto.Calories;
            mf.Proteins = dto.Proteins;
            mf.Carbs = dto.Carbs;
            mf.Fats = dto.Fats;

            await _repo.UpdateAsync(mf);
            return mf;
        }

        public async Task DeleteAsync(int mealId, int foodId)
        {
            var mf = await _repo.GetByIdAsync(mealId, foodId);
            if (mf == null)
                throw new Exception("MealFood not found");

            await _repo.DeleteAsync(mf);
        }
    }
}
