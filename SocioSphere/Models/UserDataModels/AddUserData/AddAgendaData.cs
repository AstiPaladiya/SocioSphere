namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddAgendaData
    {
        public int? SocietyMeetingId { get; set; }

        public int? UserAgendaId { get; set; }

        public string? AgendaDescription { get; set; }

        public string? Priority { get; set; }

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
