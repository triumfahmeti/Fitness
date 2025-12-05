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
        public double Calories { get; set; }
        public double Proteins { get; set; }
        public double Carbs { get; set; }
        public double Fats { get; set; }
    }
}
