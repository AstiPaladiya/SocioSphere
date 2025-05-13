using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class ComplainType
{
    public int Id { get; set; }

    public string? ComplainName { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<ComplainMaster> ComplainMasters { get; set; } = new List<ComplainMaster>();
}
