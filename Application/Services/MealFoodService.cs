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
        private readonly IFoodRepository _foodRepository;

        public MealFoodService(IMealFoodRepository repo, IFoodRepository foodRepository)
        {
            _repo = repo;
            _foodRepository = foodRepository;
        }

        public async Task<IEnumerable<MealFoodResponseDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(mf => ToDto(mf));
        }

        public async Task<MealFoodResponseDto?> GetByIdAsync(int mealId, int foodId)
        {
            var mf = await _repo.GetByIdAsync(mealId, foodId);
            return mf == null ? null : ToDto(mf);
        }

        public async Task<MealFoodResponseDto> CreateAsync(CreateEditMealFoodDto dto)
        {
            // Merr Food nga DB
            var food = await _foodRepository.GetByIdAsync(dto.FoodId);
            if (food == null)
                throw new Exception("Food not found");

            var mf = new MealFood
            {
                MealId = dto.MealId,
                FoodId = dto.FoodId,
                QuantityGrams = dto.QuantityGrams,

                Calories = (food.CaloriesPer100g * dto.QuantityGrams) / 100,
                Proteins = (food.ProteinPer100g * dto.QuantityGrams) / 100,
                Carbs = (food.CarbsPer100g * dto.QuantityGrams) / 100,
                Fats = (food.FatPer100g * dto.QuantityGrams) / 100
            };

            await _repo.AddAsync(mf);

            // Recalculate totals for the Meal
            await _repo.RecalculateMealTotalsAsync(dto.MealId);

            // map to dto and return
            return ToDto(mf);
        }


        public async Task<MealFoodResponseDto> UpdateAsync(int mealId, int foodId, CreateEditMealFoodDto dto)
        {
            var mf = await _repo.GetByIdAsync(mealId, foodId);
            if (mf == null)
                throw new Exception("MealFood not found");

            // LOAD FOOD
            var food = await _foodRepository.GetByIdAsync(foodId);
            if (food == null)
                throw new Exception("Food not found");

            mf.QuantityGrams = dto.QuantityGrams;

            mf.Calories = food.CaloriesPer100g * dto.QuantityGrams / 100;
            mf.Proteins = food.ProteinPer100g * dto.QuantityGrams / 100;
            mf.Carbs = food.CarbsPer100g * dto.QuantityGrams / 100;
            mf.Fats = food.FatPer100g * dto.QuantityGrams / 100;

            await _repo.UpdateAsync(mf);
            await _repo.RecalculateMealTotalsAsync(mealId);

            return ToDto(mf);
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

        private MealFoodResponseDto ToDto(MealFood mf)
        {
            return new MealFoodResponseDto
            {
                MealId = mf.MealId,
                FoodId = mf.FoodId,
                FoodName = mf.Food?.Name ?? string.Empty,
                QuantityGrams = mf.QuantityGrams ?? 0,
                Calories = mf.Calories ?? 0,
                Proteins = mf.Proteins ?? 0,
                Carbs = mf.Carbs ?? 0,
                Fats = mf.Fats ?? 0
            };
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
