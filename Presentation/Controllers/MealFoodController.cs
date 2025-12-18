using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.MealFoodDtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.Presentation.Controllers
{
        [Authorize(Roles = "Client")]
    [ApiController]
    [Route("api/[controller]")]
    public class MealFoodController : ControllerBase
    {
        private readonly IMealFoodService _service;

        public MealFoodController(IMealFoodService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{mealId}/{foodId}")]
        public async Task<IActionResult> GetById(int mealId, int foodId)
        {
            var mf = await _service.GetByIdAsync(mealId, foodId);
            return mf == null ? NotFound() : Ok(mf);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEditMealFoodDto dto)
        {
            return Ok(await _service.CreateAsync(dto));
        }

        [HttpPut("{mealId}/{foodId}")]
        public async Task<IActionResult> Update(int mealId, int foodId, [FromBody] CreateEditMealFoodDto dto)
        {
            return Ok(await _service.UpdateAsync(mealId, foodId, dto));
        }

        [HttpDelete("{mealId}/{foodId}")]
        public async Task<IActionResult> Delete(int mealId, int foodId)
        {
            await _service.DeleteAsync(mealId, foodId);
            return Ok();
        }



        [HttpGet("byMeal/{mealId}")]
        public async Task<IActionResult> GetByMeal(int mealId)
        {
            return Ok(await _service.GetByMealIdAsync(mealId));
        }




    }
}
