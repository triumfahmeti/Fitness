using System;
using System.Collections.Generic;

namespace Fitness.Models.Scaffolded;

public partial class Food
{
    public int FoodId { get; set; }

    public double CaloriesPer100g { get; set; }

    public double ProteinPer100g { get; set; }

    public double CarbsPer100g { get; set; }

    public double FatPer100g { get; set; }

    public string ImageUrl { get; set; } = null!;

    public virtual ICollection<MealFood> MealFoods { get; set; } = new List<MealFood>();
}
