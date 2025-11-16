using System;
using System.Collections.Generic;

namespace Fitness.Models.Scaffolded;

public partial class Admin
{
    public int AdminId { get; set; }

    public string UserId { get; set; } = null!;

    public virtual ApplicationUser User { get; set; } = null!;
}
