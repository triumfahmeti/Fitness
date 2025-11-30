using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.MealDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;

namespace Fitness.Application.Services
{
    public class MealService : IMealService
    {
        private readonly IMealRepository _repo;

        public MealService(IMealRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Meal>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Meal?> GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<Meal> CreateAsync(CreateEditMealDto dto)
        {
            var meal = new Meal
            {
                ClientId = dto.ClientId,
                MealName = dto.MealName ?? "",
                TotalCalories = dto.TotalCalories,
                TotalProteins = dto.TotalProteins,
                TotalCarbs = dto.TotalCarbs,
                TotalFats = dto.TotalFats
            };

            await _repo.AddAsync(meal);
            return meal;
        }

        public async Task<Meal> UpdateAsync(int id, CreateEditMealDto dto)
        {
            var meal = await _repo.GetByIdAsync(id);

            if (meal == null)
                throw new Exception("Meal not found");

            meal.MealName = dto.MealName ?? "";
            meal.TotalCalories = dto.TotalCalories;
            meal.TotalProteins = dto.TotalProteins;
            meal.TotalCarbs = dto.TotalCarbs;
            meal.TotalFats = dto.TotalFats;

            await _repo.UpdateAsync(meal);
            return meal;
        }

        public async Task DeleteAsync(int id)
        {
            var meal = await _repo.GetByIdAsync(id);
            if (meal == null)
                throw new Exception("Meal not found");

            await _repo.DeleteAsync(meal);
        }
    }
}
