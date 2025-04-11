using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class EventMaster
{
    public int Id { get; set; }

    public string? EventType { get; set; }

    public string? EventName { get; set; }

    public string? Description { get; set; }

    public DateOnly? EventDate { get; set; }

    public TimeOnly? EventTime { get; set; }

    public string? Destination { get; set; }

    public string? PriceType { get; set; }

    public double? Price { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<EventGallery> EventGalleries { get; set; } = new List<EventGallery>();

    public virtual ICollection<PaidEventRecord> PaidEventRecords { get; set; } = new List<PaidEventRecord>();
}
