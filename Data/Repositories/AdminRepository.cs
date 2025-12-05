using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Data.Repositories
{
    public class AdminRepository : IAdminRepository
    {
        private readonly FitnessDbContext _context;

        public AdminRepository(FitnessDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Admin>> GetAllAsync()
        {
            return await _context.Admins.Include(a => a.User).ToListAsync();
        }

        public async Task<Admin> GetByIdAsync(int id)
        {
            return await _context.Admins.Include(a => a.User)
                                        .FirstOrDefaultAsync(a => a.AdminId == id);
        }

        public async Task AddAsync(Admin admin)
        {
            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Admin admin)
        {
            _context.Admins.Update(admin);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Admin admin)
        {
            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();
        }
    }
}
