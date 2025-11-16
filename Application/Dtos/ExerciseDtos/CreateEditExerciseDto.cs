using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Application.Dtos.ExerciseDtos
{
    public class CreateEditExerciseDto
    {
        public string? Name { get; set; }

        public int Category { get; set; }

        public string? ImageUrl { get; set; }

        public string? VideoUrl { get; set; }

        public string? Description { get; set; }
    }
}