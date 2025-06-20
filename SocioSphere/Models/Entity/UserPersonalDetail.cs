using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class UserPersonalDetail
{
    public int Id { get; set; }

    public int? UserId { get; set; }

    public int? FlatNo { get; set; }

    public string? FatherName { get; set; }

    public string? MotherName { get; set; }

    public string? RelationshipStatus { get; set; }

    public string? SpouseName { get; set; }

    public string? SpouseOccupation { get; set; }

    public int? NoOfChild { get; set; }

    public DateOnly? DateOfBirth { get; set; }

    public string? Occupation { get; set; }

    public long? AnotherPhoneNo { get; set; }

    public TimeOnly? ShiftStartTime { get; set; }

    public TimeOnly? ShiftEndTime { get; set; }

    public string? WorkExperience { get; set; }

    public string? AnotherIdProof { get; set; }

    public DateOnly? JoiningDate { get; set; }

    public double? Salary { get; set; }

    public virtual UserMaster? User { get; set; }
}
