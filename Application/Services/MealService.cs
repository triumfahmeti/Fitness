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
        private readonly IMealFoodRepository _mealFoodRepo;

        public MealService(IMealRepository repo, IMealFoodRepository mealFoodRepo)
        {
            _repo = repo;
            _mealFoodRepo = mealFoodRepo;
        }

        public async Task<IEnumerable<MealResponseDto>> GetAllAsync()
        {
            var meals = await _repo.GetAllAsync();

            return meals.Select(m => new MealResponseDto
            {
                MealId = m.MealId,
                MealName = m.MealName,
                TotalCalories = m.TotalCalories,
                TotalProteins = m.TotalProteins,
                TotalCarbs = m.TotalCarbs,
                TotalFats = m.TotalFats
            });
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


            var mealFoods = await _mealFoodRepo.GetByMealIdRawAsync(id);
            foreach (var mf in mealFoods)
            {
                await _mealFoodRepo.DeleteAsync(mf);
            }


            await _repo.DeleteAsync(meal);
        }

    }
}



