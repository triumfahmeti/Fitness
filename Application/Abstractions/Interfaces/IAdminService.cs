using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Application.Dtos.AdminDtos;
using Fitness.Domain.Models; 

namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IAdminService
    {
        Task<IEnumerable<AdminDto>> GetAllAsync();
        Task<AdminDto> GetByIdAsync(int id);
        Task<Admin> CreateAsync(CreateEditAdminDto dto);
        Task<Admin> UpdateAsync(int id, CreateEditAdminDto dto);
        Task DeleteAsync(int id);
    }
}
