using System;
using System.Collections.Generic;

namespace SocioSphere.Models.Entity;

public partial class ExpensesMaster
{
    public int Id { get; set; }

    public string? ExpensesName { get; set; }

    public string? Status { get; set; }

    public DateTime? CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public virtual ICollection<ExpensesRecord> ExpensesRecords { get; set; } = new List<ExpensesRecord>();
}
