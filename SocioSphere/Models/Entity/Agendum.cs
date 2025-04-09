using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class Agendum
{
    public int Id { get; set; }

    public int? SocietyMeetingId { get; set; }

    public int? UserAgendaId { get; set; }

    public string? AgendaDescription { get; set; }

    public string? Priority { get; set; }

    public string? ActionTakenNote { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual SocietyMeeting? SocietyMeeting { get; set; }

    public virtual UserMaster? UserAgenda { get; set; }
}
