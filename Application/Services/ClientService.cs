using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.ClientDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;
using Microsoft.AspNetCore.Identity;

namespace Fitness.Application.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _repo;
        private readonly UserManager<ApplicationUser> _userManager;

        public ClientService(IClientRepository repo, UserManager<ApplicationUser> userManager)
        {
            _repo = repo;
            _userManager = userManager;
        }

        public async Task<IEnumerable<ClientDto>> GetAllAsync()
        {
            var clients = await _repo.GetAllAsync();
            return clients.Select(c => new ClientDto
            {
                ClientId = c.ClientId,
                UserId = c.UserId,
                Email = c.User.Email,
                Name = c.User.Name,
                Surname = c.User.Surname,
                Weight = c.Weight,
                Height = c.Height,
                ActivityLevel = c.ActivityLevel
            });
        }

        public async Task<ClientDto?> GetByIdAsync(int id)
        {
            var c = await _repo.GetByIdAsync(id);
            if (c == null) return null;

            return new ClientDto
            {
                ClientId = c.ClientId,
                UserId = c.UserId,
                Email = c.User.Email,
                Name = c.User.Name,
                Surname = c.User.Surname,
                Weight = c.Weight,
                Height = c.Height,
                ActivityLevel = c.ActivityLevel
            };
        }

        public async Task<ClientDto> AddAsync(CreateEditClientDto dto)
        {

            var user = new ApplicationUser
            {
                Email = dto.Email,
                UserName = dto.Email,
                Name = dto.Name,
                Surname = dto.Surname,
                Birthday = dto.Birthday,
                Gender = dto.Gender,
            };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                throw new Exception("Failed to create user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
            }

            await _userManager.AddToRoleAsync(user, "Client");

            var client = new Client
            {
                UserId = user.Id,
                Weight = dto.Weight,
                Height = dto.Height,
                ActivityLevel = dto.ActivityLevel
            };

            await _repo.AddAsync(client);

            return new ClientDto
            {
                ClientId = client.ClientId,
                UserId = client.UserId,
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Weight = client.Weight,
                Height = client.Height,
                ActivityLevel = client.ActivityLevel
            };
        }

        public async Task UpdateAsync(int id, CreateEditClientDto dto)
        {
            var client = await _repo.GetByIdAsync(id);
            if (client == null)
            {
                throw new Exception("Client not found");
            }


            client.Weight = dto.Weight;
            client.Height = dto.Height;
            client.ActivityLevel = dto.ActivityLevel;

            await _repo.UpdateAsync(client);

        }

        public async Task DeleteAsync(int id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing == null)
            {
                throw new Exception("Client not found");
            }

            await _repo.DeleteAsync(id);
        }


    }
}