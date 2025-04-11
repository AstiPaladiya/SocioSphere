using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class EventGallery
{
    public int Id { get; set; }

    public int? EventId { get; set; }

    public string? Photo { get; set; }

    public string? Description { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual EventMaster? Event { get; set; }
}
