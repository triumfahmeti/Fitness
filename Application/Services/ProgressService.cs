using System.Collections.Generic;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.ProgressDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;

namespace Fitness.Application.Services
{
    public class ProgressService : IProgressService
    {
        private readonly IProgressRepository _repo;

        public ProgressService(IProgressRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Progress>> GetAllAsync()
        {
            return await _repo.GetAllAsync();
        }

        public async Task<IEnumerable<Progress>> GetByClientIdAsync(int clientId)
        {
            return await _repo.GetByClientIdAsync(clientId);
        }

        public async Task<Progress> GetByIdAsync(int id)
        {
            return await _repo.GetByIdAsync(id);
        }

        public async Task<Progress> CreateAsync(CreateEditProgressDto dto)
        {
            var progress = new Progress
            {
                ClientId = dto.ClientId,
                Date = dto.Date,
                Weight = dto.Weight,
                Waist = dto.Waist,
                Chest = dto.Chest,
                Arm = dto.Arm,
                Thigh = dto.Thigh
            };

            await _repo.AddAsync(progress);
            return progress;
        }

        public async Task<Progress> UpdateAsync(int id, CreateEditProgressDto dto)
        {
            var progress = await _repo.GetByIdAsync(id);

            if (progress == null)
                throw new Exception("Progress not found");

            progress.ClientId = dto.ClientId;
            progress.Date = dto.Date;
            progress.Weight = dto.Weight;
            progress.Waist = dto.Waist;
            progress.Chest = dto.Chest;
            progress.Arm = dto.Arm;
            progress.Thigh = dto.Thigh;

            await _repo.UpdateAsync(progress);
            return progress;
        }

        public async Task DeleteAsync(int id)
        {
            var progress = await _repo.GetByIdAsync(id);

            if (progress == null)
                throw new Exception("Progress not found");

            await _repo.DeleteAsync(progress);
        }
    }
}
