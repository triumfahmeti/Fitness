using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.UserDtos;
using Fitness.Domain.Interfaces;

namespace Fitness.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _repo;

        public UserService(IUserRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<UserDto>> GetAllAsync()
        {
            var users = await _repo.GetAllAsync();
            return users.Select(u => new UserDto
            {
                UserId = u.Id,
                Email = u.Email,
                Name = u.Name,
                Surname = u.Surname,
                Birthday = u.Birthday,
                Gender = u.Gender
            });
        }

        public async Task<UserDto> GetByIdAsync(string id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            return new UserDto
            {
                UserId = user.Id,
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Birthday = user.Birthday,
                Gender = user.Gender
            };
        }

        public async Task<UserDto> CreateAsync(CreateUserDto dto)
        {
            var user = new Domain.Models.ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                Name = dto.Name,
                Surname = dto.Surname,
                Birthday = dto.Birthday,
                Gender = dto.Gender
            };
            await _repo.AddAsync(user, dto.Password);

            return new UserDto
            {
                UserId = user.Id,
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Birthday = user.Birthday,
                Gender = user.Gender
            };
        }

        public async Task<UserDto> UpdateAsync(string id, UpdateUserDto dto)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            user.Email = dto.Email;
            user.UserName = dto.Email;
            user.Name = dto.Name;
            user.Surname = dto.Surname;
            user.Birthday = dto.Birthday;
            user.Gender = dto.Gender;

            await _repo.UpdateAsync(user);
            return new UserDto
            {
                UserId = user.Id,
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Birthday = user.Birthday,
                Gender = user.Gender
            };
        }

        public async Task DisableAsync(string id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            await _repo.DisableAsync(id);
        }
    }
}