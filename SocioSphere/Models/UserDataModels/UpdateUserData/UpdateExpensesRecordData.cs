namespace SocioSphere.Models.UserDataModels.UpdateUserData
{
    public class UpdateExpensesRecordData
    {
        public int? ExpensesTypeId { get; set; }

        public string? ExpensesTitle { get; set; }

        public string? Description { get; set; }

        public double? Price { get; set; }

        public IFormFile? BillImage { get; set; }

        public DateOnly? ExpensesDate { get; set; }

        public string? Status { get; set; }


        public DateTime? UpdatedAt { get; set; }
    }
}
