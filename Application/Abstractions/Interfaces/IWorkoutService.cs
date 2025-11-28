using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Dtos.WorkoutDtos;
using Fitness.Domain.Models;

namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IWorkoutService
    {
        Task<IEnumerable<Workout>> GetAllAsync();
        Task<Workout> GetByIdAsync(int id);
        Task<Workout> CreateAsync(CreateEditWorkoutDto dto);
        Task<Workout> UpdateAsync(int id, CreateEditWorkoutDto dto);
        Task DeleteAsync(int id);

    }
}