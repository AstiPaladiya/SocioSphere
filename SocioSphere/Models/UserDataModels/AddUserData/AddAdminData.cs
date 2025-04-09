namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddAdminData
    {
        public int Id { get; set; }
        public int? GroupId { get; set; } = 1;
        public string? FirstName { get; set; }
        public string? MiddleName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public long? PhoneNo { get; set; }
        public string? Password { get; set; }
        public string? Status { get; set; } = "Active";

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
