using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.AdminDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;

namespace Fitness.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IAdminRepository _repo;

        public AdminService(IAdminRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<AdminDto>> GetAllAsync()
        {
            var admins = await _repo.GetAllAsync();

            return admins.Select(a => new AdminDto
            {
                AdminId = a.AdminId,
                UserId = a.UserId
            });
        }

        public async Task<AdminDto> GetByIdAsync(int id)
        {
            var a = await _repo.GetByIdAsync(id);

            if (a == null) return null;

            return new AdminDto
            {
                AdminId = a.AdminId,
                UserId = a.UserId
            };
        }

        public async Task<Admin> CreateAsync(CreateEditAdminDto dto)
        {
            var admin = new Admin
            {
                UserId = dto.UserId
            };

            await _repo.AddAsync(admin);
            return admin;
        }

        public async Task<Admin> UpdateAsync(int id, CreateEditAdminDto dto)
        {
            var admin = await _repo.GetByIdAsync(id);
            if (admin == null) throw new Exception("Admin not found");

            admin.UserId = dto.UserId;

            await _repo.UpdateAsync(admin);
            return admin;
        }

        public async Task DeleteAsync(int id)
        {
            var admin = await _repo.GetByIdAsync(id);
            if (admin == null) throw new Exception("Admin not found");

            await _repo.DeleteAsync(admin);
        }
    }
}
