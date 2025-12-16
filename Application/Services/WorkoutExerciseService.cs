using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.WorkoutExerciseDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;

namespace Fitness.Application.Services
{
    public class WorkoutExerciseService : IWorkoutExerciseService
    {
        private readonly IWorkoutExerciseRepository _repo;

        public WorkoutExerciseService(IWorkoutExerciseRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<WorkoutExerciseDto>> GetExercisesForWorkoutAsync(int workoutId)
        {
            var list = await _repo.GetByWorkoutIdAsync(workoutId);
            return list.Select(we => new WorkoutExerciseDto
            {
                WorkoutId = we.WorkoutId,
                ExerciseId = we.ExerciseId,
                Sets = we.Sets,
                Reps = we.Reps,
                ExerciseName = we.Exercise.Name,
                ImageUrl = we.Exercise.ImageUrl
            });
        }
        public async Task<WorkoutExercise> AddAsync(CreateEditWorkoutExerciseDto dto)
        {
            var workoutExercise = new WorkoutExercise
            {
                WorkoutId = dto.WorkoutId,
                ExerciseId = dto.ExerciseId,
                Sets = dto.Sets,
                Reps = dto.Reps,

            };

            await _repo.AddAsync(workoutExercise);
            return workoutExercise;
        }

        public async Task<WorkoutExercise> UpdateAsync(CreateEditWorkoutExerciseDto dto)
        {
            var workoutExercise = await _repo.GetAsync(dto.WorkoutId, dto.ExerciseId);
            if (workoutExercise == null)
            {
                throw new Exception("WorkoutExercise not found");
            }
            workoutExercise.Sets = dto.Sets;
            workoutExercise.Reps = dto.Reps;

            await _repo.UpdateAsync(workoutExercise);
            return workoutExercise;
        }

        public async Task DeleteAsync(int workoutId, int exerciseId)
        {
            var workoutExercise = await _repo.GetAsync(workoutId, exerciseId);
            if (workoutExercise == null)
            {
                throw new Exception("WorkoutExercise not found");
            }
            await _repo.DeleteAsync(workoutId, exerciseId);
        }

        // public async Task<IEnumerable<MealFoodResponseDto>> GetByMealIdAsync(int mealId)
        // {
        //     return await _repo.GetByMealIdAsync(mealId);
        // }



    }
}