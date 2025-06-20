using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles ="Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        public AdminDashboardController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }
        [HttpGet]
        [Route("dashboard")]
        public IActionResult GetAdminDashboard()
        {
            try
            {
                // Total Members
                var totalMembers = dbContext.UserMasters.Where(u=>u.GroupId==2 && u.Status=="Active").Count();

                // Total Watchmen
                var totalWatchmen = dbContext.UserMasters.Where(u => u.GroupId == 3 && u.Status=="Active").Count();

                // Current Year Total Maintenance
                var currentYear = DateTime.Now.Year;
                var currentYearTotalMaintenance = dbContext.MaintenanceRecords
                    .Where(m => m.PaidDate.HasValue && m.PaidDate.Value.Year == currentYear)
                    .Sum(m => m.TotalMaintenance ?? 0);


                // Current Year Total Expenses
                var totalExpenses = dbContext.ExpensesRecords
                    .Where(e => e.ExpensesDate.HasValue && e.ExpensesDate.Value.Year == currentYear)
                    .Sum(e => e.Price ?? 0);
                
                // Today's Visitor Count
                var today = DateOnly.FromDateTime(DateTime.Today);
                var todayVisitorCount = dbContext.Visiters
                    .Where(v => v.EntryDate.Value == today)
                    .Count();

              

             

                // Return the dashboard data
                return Ok(new
                {
                    TotalMembers = totalMembers,
                    TotalWatchmen = totalWatchmen,
                    CurrentYearTotalMaintenance = currentYearTotalMaintenance,
                    CurrentYearTotalExpenses = totalExpenses,
                    TodayVisitorCount = todayVisitorCount,
                    Message = "Welcome to the Admin Dashboard!"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while fetching the dashboard data.", details = ex.Message });
            }
        }

    }
}
