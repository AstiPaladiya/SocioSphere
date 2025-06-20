namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddComplainData
    {

        public int? UserId { get; set; }

        public int? ComplainTypeId { get; set; }

        public string? Priority { get; set; }

        public string? ComplainTitle { get; set; }

        public string? Description { get; set; }

        public IFormFile? Photo { get; set; }

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
