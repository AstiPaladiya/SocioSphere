namespace SocioSphere.Models.UserDataModels.UpdateUserData
{
    public class UpdateVisiterData
    {
        public int? VisitingUserId { get; set; }

        public string? Name { get; set; }

        public long? PhoneNo { get; set; }

        public IFormFile? Photo { get; set; }

        public DateOnly? EntryDate { get; set; }

        public TimeOnly? EntryTime { get; set; }

        public DateOnly? ExitDate { get; set; }

        public TimeOnly? ExitTime { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
