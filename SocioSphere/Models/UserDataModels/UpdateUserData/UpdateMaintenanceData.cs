namespace SocioSphere.Models.UserDataModels.UpdateUserData
{
    public class UpdateMaintenanceData
    {
        public double? MaintenanceCharge { get; set; }

        public string? Description { get; set; }

        public DateOnly? StartingMonthYear { get; set; }

        public DateOnly? EndMonthYear { get; set; }

        public DateOnly? DueMonthYear { get; set; }

        public double? LatePaymentCharge { get; set; }

        public string? MaintenanceType { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
