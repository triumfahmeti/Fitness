using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.MealDtos;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MealController : ControllerBase
    {
        private readonly IMealService _service;

        public MealController(IMealService service)
        {
            _service = service;
        }

        [HttpGet]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var meal = await _service.GetByIdAsync(id);
            return meal == null ? NotFound() : Ok(meal);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEditMealDto dto)
        {
            var meal = await _service.CreateAsync(dto);
            return Ok(meal);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateEditMealDto dto)
        {
            var meal = await _service.UpdateAsync(id, dto);
            return Ok(meal);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }
    }
}
