namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddMaintenanceData
    {
        public float? MaintenanceCharge { get; set; }

        public string? Description { get; set; }

        public int? StartingMonth { get; set; }

        public int? StartingYear { get; set; }

        public int? DueMonth { get; set; }

        public int? DueYear { get; set; }

        public string? MaintenanceType { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
