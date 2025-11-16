using System;
using System.Collections.Generic;

namespace Fitness.Domain.Models;

public partial class MealFood
{
    public int MealId { get; set; }

    public int FoodId { get; set; }

    public double? QuantityGrams { get; set; }

    public double? Calories { get; set; }

    public double? Proteins { get; set; }

    public double? Carbs { get; set; }

    public double? Fats { get; set; }

    public virtual Food Food { get; set; } = null!;

    public virtual Meal Meal { get; set; } = null!;
}
