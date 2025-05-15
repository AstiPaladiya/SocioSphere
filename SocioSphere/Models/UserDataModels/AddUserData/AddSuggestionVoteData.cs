namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddSuggestionVoteData
    {
        public int? SuggestionId { get; set; }

        public int? UserId { get; set; }

        public bool? Isliked { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
