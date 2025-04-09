using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class MaintenanceChargeMaster
{
    public int Id { get; set; }

    public float? MaintenanceCharge { get; set; }

    public string? Description { get; set; }

    public DateOnly? StartingMonthYear { get; set; }

    public DateOnly? DueMonthYear { get; set; }

    public string? MaintenanceType { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = new List<MaintenanceRecord>();
}
