using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class ComplainSuggestionMaster
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? ComplainTypeId { get; set; }

    public string? Category { get; set; }

    public string? Priority { get; set; }

    public string? ComplainTitle { get; set; }

    public string? Description { get; set; }

    public string? Photo { get; set; }

    public string? AdminActionTakenNote { get; set; }

    public DateOnly? ActionTakenDueDate { get; set; }

    public int? VotesCount { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ComplainType? ComplainType { get; set; }

    public virtual UserMaster? User { get; set; }
}
