namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddWatchmenData
    {
        public int Id { get; set; }

        public int? GroupId { get; set; } = 3;

        public string? FirstName { get; set; }

        public string? MiddleName { get; set; }

        public string? LastName { get; set; }

        public string? Email { get; set; }

        public long? PhoneNo { get; set; }

        public string? Password { get; set; }

        public string? Gender { get; set; }

        public string? Status { get; set; } = "Active";

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public int? UserId { get; set; }

        public TimeOnly? ShiftStartTime { get; set; }

        public TimeOnly? ShiftEndTime { get; set; }

        public string? WorkExperience { get; set; }

        public DateOnly? JoiningDate { get; set; }

        public double? Salary { get; set; }

    }
}
