using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class MaintenanceRecord
{
    public int Id { get; set; }

    public int? MaintenanceId { get; set; }

    public int? UserId { get; set; }

    public string? ReceiptNo { get; set; }

    public float? TotalMaintenance { get; set; }

    public DateOnly? PaidDate { get; set; }

    public DateOnly? FromMonth { get; set; }

    public DateOnly? ToMonth { get; set; }

    public string? PaymentImage { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual MaintenanceChargeMaster? Maintenance { get; set; }

    public virtual UserMaster? User { get; set; }
}
