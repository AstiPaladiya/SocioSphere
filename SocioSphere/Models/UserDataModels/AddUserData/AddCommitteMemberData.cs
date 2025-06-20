using SocioSphere.Models.Entity;

namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddCommitteMemberData
    {
        public int? CommittieTypeId { get; set; }

        public int? UserId { get; set; }

        public DateOnly? StartDate { get; set; }

        public DateOnly? EndDate { get; set; }

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
