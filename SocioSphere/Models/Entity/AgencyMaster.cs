using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class AgencyMaster
{
    public int Id { get; set; }

    public string? AgencyTypeName { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<AgencyContact> AgencyContacts { get; set; } = new List<AgencyContact>();
}
