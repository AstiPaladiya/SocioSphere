using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class CommitteMemberRecord
{
    public int Id { get; set; }

    public int? CommittieTypeId { get; set; }

    public int? UserId { get; set; }

    public DateOnly? StartDate { get; set; }

    public DateOnly? EndDate { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual SocietyCommitteMaster? CommittieType { get; set; }

    public virtual UserMaster? User { get; set; }

    public virtual ICollection<UserMaster> UserMasters { get; set; } = new List<UserMaster>();
}
