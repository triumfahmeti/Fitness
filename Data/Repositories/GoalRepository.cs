using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Data.Repositories
{
    public class GoalRepository : IGoalRepository
    {
        private readonly FitnessDbContext _context;

        public GoalRepository(FitnessDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Goal>> GetAllAsync()
        {
            return await _context.Goals.ToListAsync();
        }

        public async Task<IEnumerable<Goal>> GetByClientIdAsync(int clientId)
        {
            return await _context.Goals
                .Where(g => g.ClientId == clientId)
                .ToListAsync();
        }

        public async Task<Goal> GetByIdAsync(int id)
        {
            return await _context.Goals.FindAsync(id);
        }

        public async Task AddAsync(Goal goal)
        {
            _context.Goals.Add(goal);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Goal goal)
        {
            _context.Goals.Update(goal);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Goal goal)
        {
            _context.Goals.Remove(goal);
            await _context.SaveChangesAsync();
        }
    }
}
