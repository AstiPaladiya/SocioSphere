namespace SocioSphere.Models.UserDataModels.UpdateUserData
{
    public class UpdateComplainResponse
    {
        public string? AdminActionTakenNote { get; set; }

        public DateOnly? ActionTakenDueDate { get; set; }

        public string? Status { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
