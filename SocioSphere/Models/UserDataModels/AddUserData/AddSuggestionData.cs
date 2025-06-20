namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddSuggestionData
    {
        public int? Userid { get; set; }

        public string? SuggestionTitle { get; set; }

        public string? Description { get; set; }

        public IFormFile? Photo { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
