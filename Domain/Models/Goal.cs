using System;
using System.Collections.Generic;

namespace Fitness.Models.Scaffolded;

public partial class Goal
{
    public int GoalId { get; set; }

    public int ClientId { get; set; }

    public string GoalType { get; set; } = null!;

    public double TargetValue { get; set; }

    public bool IsAchieved { get; set; }

    public virtual Client Client { get; set; } = null!;
}
