using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class ExpensesRecord
{
    public int Id { get; set; }

    public int? ExpensesTypeId { get; set; }

    public string? ExpensesTitle { get; set; }

    public string? Description { get; set; }

    public string? Invoice { get; set; }

    public double? Price { get; set; }

    public DateOnly? ExpensesDate { get; set; }

    public string? BillImage { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ExpensesMaster? ExpensesType { get; set; }
}
