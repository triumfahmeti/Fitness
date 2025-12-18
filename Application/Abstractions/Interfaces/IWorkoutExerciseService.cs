using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Dtos.WorkoutExerciseDtos;
using Fitness.Domain.Models;

namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IWorkoutExerciseService
    {
        Task<IEnumerable<WorkoutExerciseDto>> GetExercisesForWorkoutAsync(int workoutId);
        Task<WorkoutExercise> AddAsync(CreateEditWorkoutExerciseDto dto);
        Task<WorkoutExercise> UpdateAsync(CreateEditWorkoutExerciseDto dto);
        Task DeleteAsync(int workoutId, int exerciseId);

    }
}