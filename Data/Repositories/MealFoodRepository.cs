using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;
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
    }
}
