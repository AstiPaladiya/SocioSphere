using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class UserMaster
{
    public int Id { get; set; }

    public int? GroupId { get; set; }

    public int? CommiteMemberId { get; set; }

    public string? FirstName { get; set; }

    public string? MiddleName { get; set; }

    public string? LastName { get; set; }

    public string? ProfilePhoto { get; set; }

    public string? Email { get; set; }

    public long? PhoneNo { get; set; }

    public string? Password { get; set; }

    public string? Gender { get; set; }

    public string? Address { get; set; }

    public int? TotalFamilyMember { get; set; }

    public int? AdharcardNo { get; set; }

    public double? SquarfootSize { get; set; }

    public DateOnly? LivingDate { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<Agendum> Agenda { get; set; } = new List<Agendum>();

    public virtual CommitteMemberRecord? CommiteMember { get; set; }

    public virtual ICollection<CommitteMemberRecord> CommitteMemberRecords { get; set; } = new List<CommitteMemberRecord>();

    public virtual ICollection<ComplainSuggestionMaster> ComplainSuggestionMasters { get; set; } = new List<ComplainSuggestionMaster>();

    public virtual GroupMaster? Group { get; set; }

    public virtual ICollection<MaintenanceRecord> MaintenanceRecords { get; set; } = new List<MaintenanceRecord>();

    public virtual ICollection<PaidEventRecord> PaidEventRecords { get; set; } = new List<PaidEventRecord>();

    public virtual ICollection<UserPersonalDetail> UserPersonalDetails { get; set; } = new List<UserPersonalDetail>();

    public virtual ICollection<Visiter> VisiterVisitingUsers { get; set; } = new List<Visiter>();

    public virtual ICollection<Visiter> VisiterWatchmen { get; set; } = new List<Visiter>();
}
