using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;
using Fitness.Application.Dtos.MealFoodDtos;
using Microsoft.EntityFrameworkCore;
namespace Fitness.Data.Repositories
{
    public class MealFoodRepository : IMealFoodRepository
    {
        private readonly FitnessDbContext _context;

        public MealFoodRepository(FitnessDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MealFood>> GetAllAsync()
        {
            return await _context.MealFoods
                .Include(m => m.Food)
                .Include(m => m.Meal)
                .ToListAsync();
        }

        public async Task<MealFood?> GetByIdAsync(int mealId, int foodId)
        {
            return await _context.MealFoods
                .FirstOrDefaultAsync(x => x.MealId == mealId && x.FoodId == foodId);
        }

        public async Task AddAsync(MealFood mealFood)
        {
            _context.MealFoods.Add(mealFood);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(MealFood mealFood)
        {
            _context.MealFoods.Update(mealFood);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(MealFood mealFood)
        {
            _context.MealFoods.Remove(mealFood);
            await _context.SaveChangesAsync();
        }


        public async Task<IEnumerable<MealFoodResponseDto>> GetByMealIdAsync(int mealId)
        {
            return await _context.MealFoods
                .Where(mf => mf.MealId == mealId)
                .Include(mf => mf.Food)
                .Select(mf => new MealFoodResponseDto
                {
                    MealId = mf.MealId,
                    FoodId = mf.FoodId,
                    FoodName = mf.Food.Name,
                    QuantityGrams = mf.QuantityGrams ?? 0,
                    FoodImageUrl = mf.Food.ImageUrl,
                    Calories = mf.Calories ?? 0,
                    Proteins = mf.Proteins ?? 0,
                    Carbs = mf.Carbs ?? 0,
                    Fats = mf.Fats ?? 0
                })
                .ToListAsync();
        }


        public async Task<IEnumerable<MealFood>> GetByMealIdRawAsync(int mealId)
        {
            return await _context.MealFoods
                .Where(mf => mf.MealId == mealId)
                .ToListAsync();
        }

        public async Task<Meal?> GetMealByIdAsync(int mealId)
        {
            return await _context.Meals.FindAsync(mealId);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task RecalculateMealTotalsAsync(int mealId)
        {
            var meal = await _context.Meals
                .Include(m => m.MealFoods)
                .FirstOrDefaultAsync(m => m.MealId == mealId);

            if (meal == null) return;

            meal.TotalCalories = meal.MealFoods.Sum(x => x.Calories ?? 0);
            meal.TotalProteins = meal.MealFoods.Sum(x => x.Proteins ?? 0);
            meal.TotalCarbs = meal.MealFoods.Sum(x => x.Carbs ?? 0);
            meal.TotalFats = meal.MealFoods.Sum(x => x.Fats ?? 0);

            await _context.SaveChangesAsync();
        }








    }
}
