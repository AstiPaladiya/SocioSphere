using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocioSphere.Models.Entity;

public partial class MaintenanceChargeMaster
{
    public int Id { get; set; }

    public double? MaintenanceCharge { get; set; }

    public string? Description { get; set; }

    public DateOnly? StartingMonthYear { get; set; }

    public DateOnly? EndMonthYear { get; set; }

    public DateOnly? DueMonthYear { get; set; }

    public double? LatePaymentCharge { get; set; }

    public string? MaintenanceType { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = new List<MaintenanceRecord>();
}
