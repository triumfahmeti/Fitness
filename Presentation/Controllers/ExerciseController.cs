using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.ExerciseDtos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;


namespace Fitness.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExerciseController : ControllerBase
    {
        private readonly IExerciseService _service;

        public ExerciseController(IExerciseService service)
        {
            _service = service;
        }

        [HttpGet]
        [Authorize(Roles = "Admin, Client")]

        public async Task<IActionResult> GetAll()
        {
            var exercises = await _service.GetAllAsync();
            return Ok(exercises);
        }

        [HttpGet("{id}")]
                [Authorize(Roles = "Admin, Client")]

        public async Task<IActionResult> GetById(int id)
        {
            return Ok(await _service.GetByIdAsync(id));
        }

        [HttpPost]
                [Authorize(Roles = "Admin")]

        public async Task<IActionResult> Create([FromBody] CreateEditExerciseDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return Ok(result);
        }
               


        [HttpPut("{id}")]
         [Authorize(Roles = "Admin, Client")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateEditExerciseDto dto)
        {
            var result = await _service.UpdateAsync(id, dto);
            return Ok(result);
        }

        [HttpDelete("{id}")]
                [Authorize(Roles = "Admin")]

        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return Ok();
        }
    }
}