using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.GoalDtos;
using Microsoft.AspNetCore.Mvc;




namespace Fitness.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoalController : ControllerBase
    {
        private readonly IGoalService _service;

        public GoalController(IGoalService service)
        {
            _service = service;
        }

        // GET: api/goal
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var goals = await _service.GetAllAsync();
            return Ok(goals);
        }

        // GET: api/goal/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var goal = await _service.GetByIdAsync(id);
            return Ok(goal);
        }

        // POST: api/goal
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateEditGoalDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }

        // PUT: api/goal/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateEditGoalDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(result);
        }

        // DELETE: api/goal/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }
    }
}
