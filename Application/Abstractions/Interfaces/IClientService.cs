using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Dtos.ClientDtos;

namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IClientService
    {
        Task<IEnumerable<ClientDto>> GetAllAsync();
        Task<ClientDto?> GetByIdAsync(int id);
        Task<ClientDto> AddAsync(CreateEditClientDto dto);
        Task UpdateAsync(int id, CreateEditClientDto dto);
        Task DeleteAsync(int id);
    }
}