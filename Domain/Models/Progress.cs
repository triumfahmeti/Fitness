using System;
using System.Collections.Generic;

namespace Fitness.Domain.Models;

public partial class Progress
{
    public int ProgressId { get; set; }

    public int ClientId { get; set; }

    public DateOnly Date { get; set; }

    public double? Weight { get; set; }

    public double? Waist { get; set; }

    public double? Chest { get; set; }

    public double? Arm { get; set; }

    public double? Thigh { get; set; }

    public virtual Client Client { get; set; } = null!;
}
