using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles ="Watchmen")]
    public class WatchmenDashboardController : ControllerBase
    {
        [HttpGet]
        [Route("dashboard")]
        public IActionResult GetWatchmenDashboard()
        {
            return Ok(new { message = "Welcome to the Watchmen Dashboard!" });
        }
    }
}
