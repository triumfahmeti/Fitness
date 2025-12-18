using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.ProgressDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.Presentation.Controllers
{
        [Authorize(Roles = "Client")]
    [ApiController]
    [Route("api/[controller]")]
    public class ProgressController : ControllerBase
    {
        private readonly IProgressService _service;

        public ProgressController(IProgressService service)
        {
            _service = service;
        }

        [HttpGet("client/{clientId}")]
        public async Task<IActionResult> GetByClientId(int clientId)
        {
            var progress = await _service.GetByClientIdAsync(clientId);
            return Ok(progress);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var progress = await _service.GetByIdAsync(id);
            return Ok(progress);
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateEditProgressDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, CreateEditProgressDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }
    }
}
