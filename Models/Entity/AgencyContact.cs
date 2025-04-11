using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class AgencyContact
{
    public int Id { get; set; }

    public int? AgencyTypeId { get; set; }

    public string? ContactPersonName { get; set; }

    public string? Location { get; set; }

    public string? EmailId { get; set; }

    public long? ContactNo { get; set; }

    public long? AlternateContactNo { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual AgencyMaster? AgencyType { get; set; }
}
