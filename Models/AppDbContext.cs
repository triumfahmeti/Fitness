using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Fitness.Models
{
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {


        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }


}
