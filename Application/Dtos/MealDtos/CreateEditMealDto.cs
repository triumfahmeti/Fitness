using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Application.Dtos.MealDtos
{
    public class CreateEditMealDto
    {
        public int ClientId { get; set; }
        public string? MealName { get; set; }

        public double TotalCalories { get; set; }
        public double TotalProteins { get; set; }
        public double TotalCarbs { get; set; }
        public double TotalFats { get; set; }
    }
}
