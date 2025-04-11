using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class SocietyCommitteMaster
{
    public int Id { get; set; }

    public string? CommitteName { get; set; }

    public string? Description { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<CommitteMemberRecord> CommitteMemberRecords { get; set; } = new List<CommitteMemberRecord>();
}
