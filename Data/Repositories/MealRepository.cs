using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;
using Microsoft.EntityFrameworkCore;


namespace Fitness.Data.Repositories
{
    public class MealRepository : IMealRepository
    {
        private readonly FitnessDbContext _context;

        public MealRepository(FitnessDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Meal>> GetAllAsync()
        {
            return await _context.Meals.ToListAsync();
        }

        public async Task<Meal?> GetByIdAsync(int id)
        {
            return await _context.Meals.FindAsync(id);
        }

        public async Task AddAsync(Meal meal)
        {
            _context.Meals.Add(meal);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Meal meal)
        {
            _context.Meals.Update(meal);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Meal meal)
        {
            _context.Meals.Remove(meal);
            await _context.SaveChangesAsync();
        }
    }
}
