using System;
using System.Collections.Generic;

namespace Fitness.Models.Scaffolded;

public partial class Client
{
    public int ClientId { get; set; }

    public string UserId { get; set; } = null!;

    public double Weight { get; set; }

    public double Height { get; set; }

    public int ActivityLevel { get; set; }

    public virtual ICollection<Goal> Goals { get; set; } = new List<Goal>();

    public virtual ICollection<Meal> Meals { get; set; } = new List<Meal>();

    public virtual ICollection<Progress> Progresses { get; set; } = new List<Progress>();

    public virtual ApplicationUser User { get; set; } = null!;

    public virtual ICollection<Workout> Workouts { get; set; } = new List<Workout>();
}
