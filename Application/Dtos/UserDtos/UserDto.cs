using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Fitness.Application.Dtos.UserDtos
{
    public class UserDto
    {
        public string Id { get; set; } = null!;
        public string Email { get; set; } = null!;

        public string? Name { get; set; }
        public string? Surname { get; set; }
        public DateOnly? Birthday { get; set; }
        public string? Gender { get; set; }
    }
}