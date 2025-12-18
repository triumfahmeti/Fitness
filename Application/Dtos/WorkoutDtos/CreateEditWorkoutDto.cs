using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Application.Dtos.WorkoutDtos
{
    public class CreateEditWorkoutDto
    {
        public int ClientId { get; set; }
        public string Title { get; set; } = null!;
    }
}