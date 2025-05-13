namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddSocietyMeetingData
    {
        public string? MeetingName { get; set; }

        public string? Notice { get; set; }

        public DateOnly? Date { get; set; }

        public TimeOnly? Time { get; set; }

        public IFormFile? Photo { get; set; }

        public string? Location { get; set; }

        public DateOnly? EndDate { get; set; }

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
