using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Application.Dtos.WorkoutExerciseDtos
{
    public class CreateEditWorkoutExerciseDto
    {
        public int WorkoutId { get; set; }

        public int ExerciseId { get; set; }

        public int? Sets { get; set; }

        public int? Reps { get; set; }
    }
}