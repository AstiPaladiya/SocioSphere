using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace SocioSphere.Models.Entity;

public partial class MaintenanceRecord
{
    public int Id { get; set; }

    public int? MaintenanceId { get; set; }

    public int? UserId { get; set; }

    public string? ReceiptNo { get; set; }

    public double? TotalMaintenance { get; set; }

    public DateOnly? PaidDate { get; set; }

    public string? PaymentImage { get; set; }

    public double? LatePaymentAmount { get; set; }

    public string? LatePaymentReason { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual MaintenanceChargeMaster? Maintenance { get; set; }

    public virtual UserMaster? User { get; set; }
}
