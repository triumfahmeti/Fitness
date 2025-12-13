using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Enums;

namespace Fitness.Application.Dtos.ClientDtos
{
    public class CreateEditClientDto
    {
        // Note: For update scenarios these can be null. Controllers should enforce
        // required fields only on create.
        public string Email { get; set; }
        public string? Password { get; set; }

        public string? Name { get; set; }
        public string? Surname { get; set; }
        public DateOnly? Birthday { get; set; }
        public string? Gender { get; set; }

        // Client-specific data
        public double Weight { get; set; }
        public double Height { get; set; }
        public ActivityLevel ActivityLevel { get; set; }
    }
}