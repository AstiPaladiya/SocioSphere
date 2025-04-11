namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddMemberData
    {
        public int Id { get; set; }

        public int? GroupId { get; set; } = 2;

        public string? FirstName { get; set; }

        public string? MiddleName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public long? PhoneNo { get; set; }

        public string? Password { get; set; }

        public string? Gender { get; set; }

        public double? SquarfootSize { get; set; }

        public DateOnly? LivingDate { get; set; }

        public string? Status { get; set; } = "Active";

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UserId { get; set; }

        public int? FlatNo { get; set; }

    }
}
