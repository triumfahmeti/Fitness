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
        private readonly IUserRepository _userRepo;

        public AdminService(IAdminRepository repo, IUserRepository userRepo)
        {
            _repo = repo;
            _userRepo = userRepo;
        }

        public async Task<IEnumerable<AdminDto>> GetAllAsync()
        {
            var admins = await _repo.GetAllAsync();

            var list = new List<AdminDto>();
            foreach (var a in admins)
            {
                var dto = new AdminDto
                {
                    AdminId = a.AdminId,
                    UserId = a.UserId
                };

                if (!string.IsNullOrEmpty(a.UserId))
                {
                    var user = await _userRepo.GetByIdAsync(a.UserId);
                    if (user != null)
                    {

                        dto.Email = user.Email;
                        dto.Name = user.Name;
                        dto.Surname = user.Surname;
                        dto.Gender = user.Gender;
                        dto.Birthday = user.Birthday?.ToString("yyyy-MM-dd");
                    }
                }

                list.Add(dto);
            }
            return list;
        }

        public async Task<AdminDto?> GetByIdAsync(int id)
        {
            var a = await _repo.GetByIdAsync(id);

            if (a == null) return null;

            var dto = new AdminDto
            {
                AdminId = a.AdminId,
                UserId = a.UserId
            };

            if (!string.IsNullOrEmpty(a.UserId))
            {
                var user = await _userRepo.GetByIdAsync(a.UserId);
                if (user != null)
                {

                    dto.Email = user.Email;
                    dto.Name = user.Name;
                    dto.Surname = user.Surname;
                    dto.Gender = user.Gender;
                    dto.Birthday = user.Birthday?.ToString("yyyy-MM-dd");
                }
            }

            return dto;
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
