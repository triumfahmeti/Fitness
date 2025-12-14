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
            await _repo.RecalculateMealTotalsAsync(dto.MealId);
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
            await _repo.RecalculateMealTotalsAsync(mealId);
            return mf;

        }

        public async Task DeleteAsync(int mealId, int foodId)
        {
            var mf = await _repo.GetByIdAsync(mealId, foodId);
            if (mf == null)
                throw new Exception("MealFood not found");

            await _repo.DeleteAsync(mf);
            await _repo.RecalculateMealTotalsAsync(mealId);

        }

        public async Task<IEnumerable<MealFoodResponseDto>> GetByMealIdAsync(int mealId)
        {
            return await _repo.GetByMealIdAsync(mealId);
        }

        private async Task UpdateMealTotals(int mealId)
        {
            var mealFoods = await _repo.GetByMealIdRawAsync(mealId);

            var meal = await _repo.GetMealByIdAsync(mealId);
            if (meal == null) return;

            meal.TotalCalories = mealFoods.Sum(mf => mf.Calories ?? 0);
            meal.TotalProteins = mealFoods.Sum(mf => mf.Proteins ?? 0);
            meal.TotalCarbs = mealFoods.Sum(mf => mf.Carbs ?? 0);
            meal.TotalFats = mealFoods.Sum(mf => mf.Fats ?? 0);

            await _repo.SaveChangesAsync();
        }







    }
}
