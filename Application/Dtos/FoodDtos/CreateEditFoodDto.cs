using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Application.Dtos.FoodDtos
{
   public class CreateEditFoodDto
    {
        public double CaloriesPer100g { get; set; }
        public double ProteinPer100g { get; set; }
        public double CarbsPer100g { get; set; }
        public double FatPer100g { get; set; }
        public string? ImageUrl { get; set; }
    }
}
