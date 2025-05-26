using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceRecordController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        public  MaintenanceRecordController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }

        //Member side 
        [HttpGet]
        [Route("getAllMaintenanceDetailByMember")]
        public IActionResult getAllMaintenanceByMember()
        {
            try
            {
                var maintenanceDetial=(from m in dbContext.MaintenanceChargeMasters 
                                       join mr in dbContext.MaintenanceRecords on m.Id equals mr.MaintenanceId
                                       select data => { 
                                            
                                       }).ToList();
            }
            catch (Exception ex) { 
            
            }
    }
}
