namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddGalleryData
    {
        public int? UserId { get; set; }

        public int? EventId { get; set; }

        public IFormFile? Photo { get; set; }

        public string? Description { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }


    }
}
