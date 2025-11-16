using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Dtos.ExerciseDtos;
using Fitness.Domain.Models;

namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IExerciseService
    {
        Task<IEnumerable<Exercise>> GetAllAsync();
        Task<Exercise> GetByIdAsync(int id);
        Task<Exercise> CreateAsync(CreateEditExerciseDto dto);
        Task<Exercise> UpdateAsync(int id, CreateEditExerciseDto dto);
        Task DeleteAsync(int id);
    }
}