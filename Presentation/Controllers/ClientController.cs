using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.ClientDtos;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clients = await _clientService.GetAllAsync();
            return Ok(clients);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var client = await _clientService.GetByIdAsync(id);
            if (client == null)
                return NotFound();

            return Ok(client);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEditClientDto dto)
        {
            // Enforce required fields only for create

            if (string.IsNullOrWhiteSpace(dto.Password))
            {
                ModelState.AddModelError("Password", "The Password field is required.");
            }
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var createdClient = await _clientService.AddAsync(dto);
            return Ok(createdClient);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateEditClientDto dto)
        {
            // Do not require Email/Password on update; allow partial updates
            await _clientService.UpdateAsync(id, dto);
            return Ok("Client updated successfully!");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _clientService.DeleteAsync(id);
            return Ok("Client deleted successfully!");
        }
    }
}