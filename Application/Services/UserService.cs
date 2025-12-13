using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.UserDtos;
using Fitness.Domain.Interfaces;
using Fitness.Domain.Models;

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
                Id = u.Id,
                Email = u.Email,
                Name = u.Name,
                Surname = u.Surname,
                Birthday = u.Birthday,
                Gender = u.Gender
            });
        }

        public async Task<UserDto?> GetByIdAsync(string id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
            {
                return null;
            }
            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Birthday = user.Birthday,
                Gender = user.Gender
            };
        }

        public async Task<UserDto> CreateAsync(CreateUserDto dto)
        {
            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                Name = dto.Name,
                Surname = dto.Surname,
                Birthday = dto.Birthday,
                Gender = dto.Gender
            };

            var result = await _repo.AddAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                throw new Exception(
                    string.Join("; ", result.Errors.Select(e => e.Description))
                );
            }

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Birthday = user.Birthday,
                Gender = user.Gender
            };
        }


        public async Task<UserDto?> UpdateAsync(string id, UpdateUserDto dto)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
            {
                return null;
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
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Birthday = user.Birthday,
                Gender = user.Gender
            };
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var user = await _repo.GetByIdAsync(id);
            if (user == null)
            {
                return false;
            }
            return await _repo.DeleteAsync(id);
        }
    }
}