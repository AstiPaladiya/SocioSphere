using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class Visiter
{
    public int Id { get; set; }

    public int? VisitingUserId { get; set; }

    public int? WatchmenId { get; set; }

    public string? Name { get; set; }

    public long? PhoneNo { get; set; }

    public string? Photo { get; set; }

    public DateOnly? EntryDate { get; set; }

    public TimeOnly? EntryTime { get; set; }

    public DateOnly? ExitDate { get; set; }

    public TimeOnly? ExitTime { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual UserMaster? VisitingUser { get; set; }

    public virtual UserMaster? Watchmen { get; set; }
}
