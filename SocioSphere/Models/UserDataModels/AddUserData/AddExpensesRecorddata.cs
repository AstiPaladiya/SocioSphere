namespace SocioSphere.Models.UserDataModels.AddUserData
{
    public class AddExpensesRecorddata
    {
        public int? ExpensesTypeId { get; set; }

        public string? ExpensesTitle { get; set; }

        public string? Description { get; set; }

        public double? Price { get; set; }

        public DateOnly? ExpensesDate { get; set; }

        public string? Status { get; set; }

        public DateTime? CreatedAt { get; set; }

        public DateTime? UpdatedAt { get; set; }

    }
}
