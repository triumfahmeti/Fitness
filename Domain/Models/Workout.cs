using System;
using System.Collections.Generic;

namespace Fitness.Domain.Models;

public partial class Workout
{
    public int WorkoutId { get; set; }

    public int ClientId { get; set; }

    public string Title { get; set; } = null!;

    public virtual Client Client { get; set; } = null!;

    public virtual ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
}
