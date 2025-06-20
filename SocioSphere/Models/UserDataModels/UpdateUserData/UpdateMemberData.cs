namespace SocioSphere.Models.UserDataModels.UpdateUserData
{
    public class UpdateMemberData
    {

        public string? FirstName { get; set; }

        public string? MiddleName { get; set; }

        public string? LastName { get; set; }

        public IFormFile? ProfilePhoto { get; set; }

        public string? Address { get; set; }

        public string? Email { get; set; }

        public long? PhoneNo { get; set; }
        public string? Gender { get; set; }

        public int? TotalFamilyMember { get; set; }

        public int? AdharcardNo { get; set; }


        public double? SquarfootSize { get; set; }

        public DateOnly? LivingDate { get; set; }


        public DateTime? UpdatedAt { get; set; }

        public int? FlatNo { get; set; }

        public string? RelationshipStatus { get; set; }

        public string? FatherName { get; set; }

        public string? MotherName { get; set; }

        public string? SpouseName { get; set; }

        public string? SpouseOccupation { get; set; }

        public int? NoOfChild { get; set; }

        public DateOnly? DateOfBirth { get; set; }

        public string? Occupation { get; set; }

        public long? AnotherPhoneNo { get; set; }

        public IFormFile? AnotherIdProof { get; set; }
    }
}
