using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class PaidEventRecord
{
    public int Id { get; set; }

    public int? EventId { get; set; }

    public int? UserId { get; set; }

    public int? TotalMember { get; set; }

    public double? TotalPrice { get; set; }

    public string? PaymentImage { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual EventMaster? Event { get; set; }

    public virtual UserMaster? User { get; set; }
}
