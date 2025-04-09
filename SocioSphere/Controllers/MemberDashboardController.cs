using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles ="Member")]
    public class MemberDashboardController : ControllerBase
    {
        [HttpGet]
        [Route("dashboard")]
        public IActionResult GetMemberDashboard()
        {
            return Ok(new { message = "Welcome to the Member Dashboard!" });
        }
    }
}
