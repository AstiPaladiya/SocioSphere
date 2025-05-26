using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenceController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable

        //contruct of this controller
        public MaintenceController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult getAllMaintenance()
        {
            try
            {
                var maintenace = dbContext.MaintenanceChargeMasters.
                    Select(m => new
                    {
                        m.Id,
                        m.MaintenanceCharge,
                        m.MaintenanceType,
                        m.StartingMonthYear,
                        m.DueMonthYear,
                        m.Description,
                        IsEditable = dbContext.MaintenanceRecords.Any(r => r.MaintenanceId == m.Id)
                    }).ToList();
                if (maintenace == null || !maintenace.Any())
                {
                        
                    return NotFound(new { message = "Maintenace record not available" });
                }
                return Ok(maintenace);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpGet]
        [Route("getMaintenanceById/{id:int}")]
        public IActionResult getAllMaintenance(int id)
        {
            try
            {
                var maintenance = dbContext.MaintenanceChargeMasters.Find(id);
                if (maintenance == null)
                {
                    return NotFound(new { message = "Maintenance record not found" });
                }
               
                return Ok(maintenance);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }


        [HttpPost]
        public IActionResult addMaintenace(AddMaintenanceData addData)
        {
            try
            {
                var start = new DateOnly((int)addData.StartingYear, (int)addData.StartingMonth, 1);
                var end = new DateOnly((int)addData.DueYear, (int)addData.DueMonth, 31);

                var maintenaceEntity = new MaintenanceChargeMaster
                {
                    MaintenanceCharge = addData.MaintenanceCharge,
                    Description = addData.Description,
                    StartingMonthYear = start,
                    DueMonthYear = end,
                    MaintenanceType = addData.MaintenanceType,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.MaintenanceChargeMasters.Add(maintenaceEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Maintenance detail added successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpPut]
        [Route("updateMaintenace/{id:int}")]
        public IActionResult updateMaintenace(int id,UpdateMaintenanceData upData)
        {
            try
            {
                var manId = dbContext.MaintenanceChargeMasters.Find(id);
                if (manId == null)
                {
                    return NotFound(new { message = "Maintenance detail not found" });
                }
                else
                {
                    var chkManRecordId = dbContext.MaintenanceRecords.FirstOrDefault(m => m.MaintenanceId == id);
                    var start = new DateOnly((int)upData.StartingYear, (int)upData.StartingMonth, 1);
                    var end = new DateOnly((int)upData.DueYear, (int)upData.DueMonth, 31);

                    if (chkManRecordId == null)
                    {
                        manId.MaintenanceCharge = upData.MaintenanceCharge;
                        manId.MaintenanceType = upData.MaintenanceType;
                        manId.Description = upData.Description;
                        manId.StartingMonthYear = start;
                        manId.DueMonthYear = end;
                        manId.UpdatedAt = DateTime.UtcNow;
                        dbContext.SaveChanges();
                        return Ok(new { message = "Maintenance detail updated successfully" });
                    }
                    else
                    {
                        return BadRequest(new { message = "Cannot update this maintenance record because some members have already paid for it." });
                    }
                }

            }
            catch (Exception ex) {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });


            }
        }
    }
}
