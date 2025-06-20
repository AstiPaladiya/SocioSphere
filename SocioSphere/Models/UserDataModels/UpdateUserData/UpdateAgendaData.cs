namespace SocioSphere.Models.UserDataModels.UpdateUserData
{
    public class UpdateAgendaData
    {
        public int? SocietyMeetingId { get; set; }

        public int? UserAgendaId { get; set; }

        public string? AgendaDescription { get; set; }

        public string? Priority { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
