using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class MealResponseDto
{
    public int MealId { get; set; }
    public string MealName { get; set; } = string.Empty;

    public double TotalCalories { get; set; }
    public double TotalProteins { get; set; }
    public double TotalCarbs { get; set; }
    public double TotalFats { get; set; }
}
