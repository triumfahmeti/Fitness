namespace Fitness.Application.Dtos.AdminDtos
{
    public class AdminDto
    {
        public int AdminId { get; set; }
        public string UserId { get; set; } = null!;

        // Enriched fields from ApplicationUser for profile display

        public string? Email { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Gender { get; set; }
        public string? Birthday { get; set; }
    }
}
