using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fitness.Domain.Enums;

namespace Fitness.Application.Dtos.ClientDtos
{
    public class ClientDto
    {
        public int ClientId { get; set; }
        public string UserId { get; set; }


        public string Email { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public DateOnly? Birthday { get; set; }

        public string? Gender { get; set; }



        public double Weight { get; set; }
        public double Height { get; set; }
        public ActivityLevel ActivityLevel { get; set; }
    }
}