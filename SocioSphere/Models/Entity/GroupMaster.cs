using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class GroupMaster
{
    public int Id { get; set; }

    public string? GroupName { get; set; }

    public virtual ICollection<UserMaster> UserMasters { get; set; } = new List<UserMaster>();
}
