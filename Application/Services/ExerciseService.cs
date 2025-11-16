using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.ExerciseDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;

namespace Fitness.Application.Services
{
    public class ExerciseService : IExerciseService
    {
        private readonly IExerciseRepository _repo;

        public ExerciseService(IExerciseRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Exercise>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Exercise> GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<Exercise> CreateAsync(CreateEditExerciseDto dto)
        {
            var exercise = new Exercise
            {
                Name = dto.Name,
                Category = dto.Category,
                ImageUrl = dto.ImageUrl,
                VideoUrl = dto.VideoUrl,
                Description = dto.Description
            };

            await _repo.AddAsync(exercise);
            return exercise;
        }

        public async Task<Exercise> UpdateAsync(int id, CreateEditExerciseDto dto)
        {
            var exercise = await _repo.GetByIdAsync(id);
            if (exercise == null)
            {
                throw new Exception("Exercise not found");
            }
            exercise.Name = dto.Name;
            exercise.Category = dto.Category;
            exercise.ImageUrl = dto.ImageUrl;
            exercise.VideoUrl = dto.VideoUrl;
            exercise.Description = dto.Description;

            await _repo.UpdateAsync(exercise);
            return exercise;
        }
        public async Task DeleteAsync(int id)
        {
            var exercise = await _repo.GetByIdAsync(id);
            if (exercise == null)
            {
                throw new Exception("Exercise not found");
            }
            await _repo.DeleteAsync(exercise);
        }
    }
}