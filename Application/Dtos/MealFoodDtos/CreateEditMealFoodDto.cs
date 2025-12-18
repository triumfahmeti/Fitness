using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Application.Dtos.MealFoodDtos
{
    public class CreateEditMealFoodDto
    {
        public int MealId { get; set; }
        public int FoodId { get; set; }
        public double QuantityGrams { get; set; }

    }
}
