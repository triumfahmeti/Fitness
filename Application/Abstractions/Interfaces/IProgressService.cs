using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Application.Dtos.ProgressDtos;
using Fitness.Domain.Models;

namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IProgressService
    {
        Task<IEnumerable<Progress>> GetAllAsync();
        Task<IEnumerable<Progress>> GetByClientIdAsync(int clientId);
        Task<Progress> GetByIdAsync(int id);
        Task<Progress> CreateAsync(CreateEditProgressDto dto);
        Task<Progress> UpdateAsync(int id, CreateEditProgressDto dto);
        Task DeleteAsync(int id);
    }
}
