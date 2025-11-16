using System;
using System.Collections.Generic;

namespace Fitness.Models.Scaffolded;

public partial class Meal
{
    public int MealId { get; set; }

    public int ClientId { get; set; }

    public string MealName { get; set; } = null!;

    public double TotalCalories { get; set; }

    public double TotalProteins { get; set; }

    public double TotalCarbs { get; set; }

    public double TotalFats { get; set; }

    public virtual Client Client { get; set; } = null!;

    public virtual ICollection<MealFood> MealFoods { get; set; } = new List<MealFood>();
}
