namespace SocioSphere.Models.UserDataModels.UpdateUserData
{
    public class UpdateSocietyMeetingData
    {
        public string? MeetingName { get; set; }

        public string? Notice { get; set; }

        public DateOnly? Date { get; set; }

        public TimeOnly? Time { get; set; }

        public IFormFile? Photo { get; set; }

        public string? Location { get; set; }

        public DateOnly? EndDate { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
