using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Data.Repositories
{
    public class FoodRepository : IFoodRepository
    {
        private readonly FitnessDbContext _context;

        public FoodRepository(FitnessDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Food>> GetAllAsync()
        {
            return await _context.Foods.ToListAsync();
        }

        public async Task<Food> GetByIdAsync(int id)
        {
            return await _context.Foods.FindAsync(id);
        }

        public async Task AddAsync(Food food)
        {
            _context.Foods.Add(food);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Food food)
        {
            _context.Foods.Update(food);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Food food)
        {
            _context.Foods.Remove(food);
            await _context.SaveChangesAsync();
        }
    }
}
