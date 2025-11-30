using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Data.Repositories
{
    public class ProgressRepository : IProgressRepository
    {
        private readonly FitnessDbContext _context;

        public ProgressRepository(FitnessDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Progress>> GetAllAsync()
        {
            return await _context.Progresses.ToListAsync();
        }

        public async Task<Progress> GetByIdAsync(int id)
        {
            return await _context.Progresses.FindAsync(id);
        }

        public async Task AddAsync(Progress progress)
        {
            _context.Progresses.Add(progress);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Progress progress)
        {
            _context.Progresses.Update(progress);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Progress progress)
        {
            _context.Progresses.Remove(progress);
            await _context.SaveChangesAsync();
        }
    }
}
