namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddCommitteData
    {
        public string? CommitteName { get; set; }

        public string? Description { get; set; }

        public string? Status { get; set; } = "Active";

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
