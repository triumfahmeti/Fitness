using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Application.Dtos.GoalDtos

{
    public class CreateEditGoalDto
    {
        public int ClientId { get; set; }

        public string? GoalType { get; set; }

        public double TargetValue { get; set; }

        public bool IsAchieved { get; set; }
    }
}
