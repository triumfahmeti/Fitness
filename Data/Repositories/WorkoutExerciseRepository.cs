using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Data.Repositories
{
    public class WorkoutExerciseRepository : IWorkoutExerciseRepository
    {
        private readonly FitnessDbContext _context;
        public WorkoutExerciseRepository(FitnessDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<WorkoutExercise>> GetByWorkoutIdAsync(int workoutId)
        {
            return await _context.WorkoutExercises
                .Where(we => we.WorkoutId == workoutId)
                .ToListAsync();
        }

        public async Task<WorkoutExercise?> GetAsync(int workoutId, int exerciseId)
        {
            return await _context.WorkoutExercises
                .FirstOrDefaultAsync(we => we.WorkoutId == workoutId && we.ExerciseId == exerciseId);
        }

        public async Task AddAsync(WorkoutExercise entity)
        {
            _context.WorkoutExercises.Add(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(WorkoutExercise entity)
        {
            _context.WorkoutExercises.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int workoutId, int exerciseId)
        {
            var entity = await GetAsync(workoutId, exerciseId);
            if (entity != null)
            {
                _context.WorkoutExercises.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

    }

    public interface IWorkoutExercise
    {
    }
}