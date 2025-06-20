namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddMaintenancePaymentData
    {
        public int? MaintenanceId { get; set; }

        public int? UserId { get; set; }

        public double? TotalMaintenance { get; set; }

        public DateOnly? PaidDate { get; set; }

        public IFormFile? PaymentImage { get; set; }

        public double? LatePaymentAmount { get; set; }

        public string? LatePaymentReason { get; set; }

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
