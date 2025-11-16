using System;
using System.Collections.Generic;

namespace Fitness.Models.Scaffolded;

public partial class Exercise
{
    public int ExerciseId { get; set; }

    public int ClientId { get; set; }

    public string Name { get; set; } = null!;

    public int Category { get; set; }

    public string? ImageUrl { get; set; }

    public string? VideoUrl { get; set; }

    public string? Description { get; set; }

    public virtual ICollection<WorkoutExercise> WorkoutExercises { get; set; } = new List<WorkoutExercise>();
}
