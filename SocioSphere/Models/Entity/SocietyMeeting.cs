using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class SocietyMeeting
{
    public int Id { get; set; }

    public string? MeetingName { get; set; }

    public string? Notice { get; set; }

    public DateOnly? Date { get; set; }

    public TimeOnly? Time { get; set; }

    public string? Photo { get; set; }

    public string? Location { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Agendum> Agenda { get; set; } = new List<Agendum>();
}
