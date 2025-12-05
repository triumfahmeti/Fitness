using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Application.Dtos.GoalDtos;
using Fitness.Domain.Models;

namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IGoalService
    {
        Task<IEnumerable<Goal>> GetAllAsync();
        Task<Goal> GetByIdAsync(int id);
        Task<Goal> CreateAsync(CreateEditGoalDto dto);
        Task<Goal> UpdateAsync(int id, CreateEditGoalDto dto);
        Task DeleteAsync(int id);
    }
}
