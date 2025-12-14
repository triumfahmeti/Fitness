using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class MealFoodResponseDto
{
    public int MealId { get; set; }
    public int FoodId { get; set; }

    public string FoodName { get; set; } = null!;
    public double QuantityGrams { get; set; }

    public double Calories { get; set; }
    public double Proteins { get; set; }
    public double Carbs { get; set; }
    public double Fats { get; set; }
}
