using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Application.Dtos.WorkoutExerciseDtos
{
    public class WorkoutExerciseResponseDto
    {
        public int WorkoutId { get; set; }
        public int ExerciseId { get; set; }

        public string ExerciseName { get; set; } = null!;
        public int Sets { get; set; }

        public string? ExerciseImageUrl { get; set; }
    }
}