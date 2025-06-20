using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using System;
using System.Linq;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize(Roles = "Member")]
    public class MemberDashboardController : ControllerBase
    {
        private readonly SociosphereContext dbContext;

        public MemberDashboardController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        [Route("dashboard")]
        public IActionResult GetMemberDashboard()
        {
            try
            {
                // Get logged-in member's ID from JWT token
                string mid = Request.Headers["userid"].ToString();
                var memberId = int.Parse(mid);

                // Member Info
                var member = dbContext.UserMasters.FirstOrDefault(u => u.Id == memberId);
                if (member == null) return NotFound(new { message = "Member not found." });

                // Maintenance Details
                var pendingMaintenance = dbContext.MaintenanceRecords
                    .Where(m => m.UserId == memberId && m.Status == "Awaiting Approval")
                    .Select(m => new { m.TotalMaintenance, m.PaidDate })
                    .FirstOrDefault();

                

                // Visitor Logs
                var today = DateOnly.FromDateTime(DateTime.Today);
                var todayVisitorCount = dbContext.Visiters
                    .Where(v => v.VisitingUserId == memberId && v.EntryDate == today)
                    .Count();

                var reject = dbContext.ComplainMasters
                    .Where(c => c.UserId == memberId && c.Status == "Rejected")
                    .Count();

                // Complaints
                var pendingComplaints = dbContext.ComplainMasters
                    .Where(c => c.UserId == memberId && c.Status == "Pending")
                    .Count();

                var resolvedComplaints = dbContext.ComplainMasters
                    .Where(c => c.UserId == memberId && c.Status == "In Progress")
                    .Count();

                var complete = dbContext.ComplainMasters
                    .Where(c => c.UserId == memberId && c.Status == "Completed")
                    .Count();





                // Return the dashboard data
                return Ok(new
                {
                   
                    maintenanceDetails = new
                    {
                        pendingMaintenance,
                       
                    },
                    visitorLogs = new
                    {
                        todayVisitorCount,
                        
                    },
                    complaints = new
                    {
                        pendingCount = pendingComplaints,
                        resolvedCount = resolvedComplaints,
                        completedCount = complete,
                        rejectedCount = reject
                    },
                    
                 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while fetching the dashboard data.", details = ex.Message });
            }
        }
    }
}