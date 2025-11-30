using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.GoalDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;
using Fitness.Application.Abstractions.Interfaces;

namespace Fitness.Application.Abstractions.Interfaces

{
    public class GoalService : IGoalService
    {
        private readonly IGoalRepository _repo;

        public GoalService(IGoalRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Goal>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<Goal> GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<Goal> CreateAsync(CreateEditGoalDto dto)
        {
            var goal = new Goal
            {
                ClientId = dto.ClientId,
                GoalType = dto.GoalType,
                TargetValue = dto.TargetValue,
                IsAchieved = dto.IsAchieved
            };

            await _repo.AddAsync(goal);
            return goal;
        }

        public async Task<Goal> UpdateAsync(int id, CreateEditGoalDto dto)
        {
            var goal = await _repo.GetByIdAsync(id);
            if (goal == null)
            {
                throw new Exception("Goal not found");
            }

            goal.ClientId = dto.ClientId;
            goal.GoalType = dto.GoalType;
            goal.TargetValue = dto.TargetValue;
            goal.IsAchieved = dto.IsAchieved;

            await _repo.UpdateAsync(goal);
            return goal;
        }

        public async Task DeleteAsync(int id)
        {
            var goal = await _repo.GetByIdAsync(id);
            if (goal == null)
            {
                throw new Exception("Goal not found");
            }

            await _repo.DeleteAsync(goal);
        }
    }
}
