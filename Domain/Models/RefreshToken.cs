using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Fitness.Domain.Models; // <--- add this

namespace Fitness.Domain.Models
{
    public class RefreshToken
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Token { get; set; } = null!;

        [Required]
        public string UserId { get; set; } = null!;

        [ForeignKey(nameof(UserId))]
        public ApplicationUser? User { get; set; }  // now it works

        public DateTime Expires { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime Created { get; set; } = DateTime.UtcNow;

        [NotMapped]
        public bool IsActive => !IsRevoked && DateTime.UtcNow <= Expires;
    }
}
