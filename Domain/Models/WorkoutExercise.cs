using System;
using System.Collections.Generic;

namespace Fitness.Models.Scaffolded;

public partial class WorkoutExercise
{
    public int WorkoutId { get; set; }

    public int ExerciseId { get; set; }

    public int? Sets { get; set; }

    public int? Reps { get; set; }

    public virtual Exercise Exercise { get; set; } = null!;

    public virtual Workout Workout { get; set; } = null!;
}
