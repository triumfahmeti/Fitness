using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.WorkoutDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;

namespace Fitness.Application.Services
{
    public class WorkoutService : IWorkoutService
    {
        private readonly IWorkoutRepository _repo;
        public WorkoutService(IWorkoutRepository repo)
        {
            _repo = repo;
        }
        public Task<IEnumerable<Workout>> GetAllAsync()
        {
            return _repo.GetAllAsync();
        }

        public Task<Workout> GetByIdAsync(int id)
        {
            return _repo.GetByIdAsync(id);
        }

        public async Task<Workout> CreateAsync(CreateEditWorkoutDto dto)
        {
            var workout = new Workout
            {
                Title = dto.Title
            };
            await _repo.AddAsync(workout);
            return workout;
        }

        public async Task<Workout> UpdateAsync(int id, CreateEditWorkoutDto dto)
        {
            var workout = await _repo.GetByIdAsync(id);
            if (workout == null)
            {
                throw new Exception("Workout not found");
            }
            workout.Title = dto.Title;
            await _repo.UpdateAsync(workout);
            return workout;
        }

        public async Task DeleteAsync(int id)
        {
            var workout = await _repo.GetByIdAsync(id);
            if (workout == null)
            {
                throw new Exception("Workout not found");
            }
            await _repo.DeleteAsync(workout);
        }
    }
}