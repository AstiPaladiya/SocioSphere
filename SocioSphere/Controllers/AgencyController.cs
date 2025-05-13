using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgencyController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        public AgencyController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        public IActionResult addAgenecy(AddAgencyData agency)
        {
            try
            {
                var agencyEntity = new AgencyMaster
                {
                    AgencyTypeName = agency.AgencyTypeName,
                    Status = "Active",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = null
                };
                dbContext.AgencyMasters.Add(agencyEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Agency added succesfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        [HttpPut]
        [Route("{id:Int}")]
        public IActionResult updateAgency(int id, UpdateAgencyData agencyData)
        {
            try
            {
                var agency = dbContext.AgencyMasters.Find(id);
                if (agency == null)
                {
                    return NotFound(new { message = "Agency not found" });
                }
                agency.AgencyTypeName = agencyData.AgencyTypeName;
                agency.UpdatedAt = DateTime.Now;
                dbContext.SaveChanges();
                return Ok(new { message = "Agency updated successfuly" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpGet]
        public IActionResult getAllAgency()
        {
            try
            {
                var agency = dbContext.AgencyMasters.ToList();
                if (agency == null || !agency.Any())
                {
                    return NotFound(new { message = "Agency not found!" });
                }
                return Ok(agency);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpGet]
        [Route("{id:int}")]
        public IActionResult getAgencyById(int id)
        {
            try
            {
                var agency = dbContext.AgencyMasters.Find(id);
                if (agency == null)
                {
                    return NotFound(new { message = "Agency not found!" });
                    
                }
                return Ok(agency);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpPut]
        [Route("toggleStatus/{id:int}")]
        public IActionResult toggleAgencyStatus(int id) {
            try
            {
                var agency = dbContext.AgencyMasters.Find(id);
                if (agency == null)
                {
                    return NotFound(new { message = "Agency not found!" });

                }
                if (agency.Status == "Active")
                {
                    agency.Status = "Block";
                }
                else
                {
                    agency.Status = "Active";
                }
                agency.UpdatedAt = DateTime.Now;
                dbContext.SaveChanges();
                return Ok(new { message = $"Agency status {agency.Status} succesfully" });
            }
            catch (Exception ex) {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
    }
        
}
