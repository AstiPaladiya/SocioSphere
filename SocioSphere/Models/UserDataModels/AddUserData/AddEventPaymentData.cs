namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddEventPaymentData
    {
        public int? EventId { get; set; }

        public int? UserId { get; set; }

        public int? TotalMember { get; set; }

        public double? TotalPrice { get; set; }

        public IFormFile? PaymentImage { get; set; }

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
