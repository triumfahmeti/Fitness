using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Fitness.Application.Dtos.WorkoutExerciseDtos;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutExerciseController : ControllerBase
    {
        private readonly IWorkoutExerciseService _service;

        public WorkoutExerciseController(IWorkoutExerciseService service)
        {
            _service = service;
        }

        [HttpGet("{workoutId}/exercises")]
        public async Task<IActionResult> GetExercisesForWorkout(int workoutId)
        {
            var exercises = await _service.GetExercisesForWorkoutAsync(workoutId);
            return Ok(exercises);
        }

        [HttpPost]
        public async Task<IActionResult> AddWorkoutExercise([FromBody] CreateEditWorkoutExerciseDto dto)
        {
            var workoutExercise = await _service.AddAsync(dto);
            return workoutExercise != null ? Ok(workoutExercise) : BadRequest();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateWorkoutExercise([FromBody] CreateEditWorkoutExerciseDto dto)
        {
            var workoutExercise = await _service.UpdateAsync(dto);
            return workoutExercise != null ? Ok(workoutExercise) : NotFound();
        }

        [HttpDelete("{workoutId}/exercises/{exerciseId}")]
        public async Task<IActionResult> DeleteWorkoutExercise(int workoutId, int exerciseId)
        {

            await _service.DeleteAsync(workoutId, exerciseId);
            return Ok("Deleted successfully!");
        }

        // [HttpGet("byMeal/{mealId}")]
        // public async Task<IActionResult> GetByMeal(int mealId)
        // {
        //     return Ok(await _service.GetByMealIdAsync(mealId));
        // }

    }
}