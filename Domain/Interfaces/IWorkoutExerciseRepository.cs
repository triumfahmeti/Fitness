using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Models;

namespace Fitness.Domain.Interfaces
{
    public interface IWorkoutExerciseRepository
    {
        Task<IEnumerable<WorkoutExercise>> GetByWorkoutIdAsync(int workoutId);
        Task<WorkoutExercise?> GetAsync(int workoutId, int exerciseId);
        Task AddAsync(WorkoutExercise entity);
        Task UpdateAsync(WorkoutExercise entity);
        Task DeleteAsync(int workoutId, int exerciseId);

        // Task<IEnumerable<MealFoodResponseDto>> GetByMealIdAsync(int mealId);
        // Task<IEnumerable<MealFood>> GetByMealIdRawAsync(int mealId);
        // Task<Meal?> GetMealByIdAsync(int mealId);
    }
}