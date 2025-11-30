using System;

namespace Fitness.Application.Dtos.ProgressDtos
{
    public class CreateEditProgressDto
    {
        public int ClientId { get; set; }
        public DateOnly Date { get; set; }
        public double? Weight { get; set; }
        public double? Waist { get; set; }
        public double? Chest { get; set; }
        public double? Arm { get; set; }
        public double? Thigh { get; set; }
    }
}
