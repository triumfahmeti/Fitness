using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Application.Dtos.WorkoutExerciseDtos
{
    public class WorkoutExerciseDto
    {
        public int WorkoutId { get; set; }

        public int ExerciseId { get; set; }

        public int? Sets { get; set; }

        public int? Reps { get; set; }
        public string ExerciseName { get; set; } = null!;
    }
}