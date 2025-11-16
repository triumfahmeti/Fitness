using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;


namespace Fitness.Domain.Models;

public class ApplicationUser : IdentityUser
{
    public string? Name { get; set; }
    public virtual ICollection<Admin> Admins { get; set; } = new List<Admin>();
    public virtual ICollection<Client> Clients { get; set; } = new List<Client>();
}
