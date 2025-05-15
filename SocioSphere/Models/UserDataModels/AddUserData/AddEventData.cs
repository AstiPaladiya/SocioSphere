namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddEventData
    {

        public string? EventType { get; set; }

        public string? EventName { get; set; }

        public string? Description { get; set; }

        public DateOnly? EventDate { get; set; }

        public TimeOnly? EventTime { get; set; }

        public string? Destination { get; set; }

        public string? PriceType { get; set; }

        public double? Price { get; set; }

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
