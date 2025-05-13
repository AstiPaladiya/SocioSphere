using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

namespace SocioSphere.Controllers
{
    //localhost:portnumber/api/SocietyCommitte
    [Route("api/[controller]")]
    [ApiController]
    public class SocietyCommitteController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable

        //contruct of this controller
        public SocietyCommitteController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }
       
        //Display all Data
        [HttpGet]
        public IActionResult getAllCommitte()
        {
            try
            {
                var allCommitte = dbContext.SocietyCommitteMasters.ToList();
                if (allCommitte == null || !allCommitte.Any())
                {
                    return NotFound(new { message = "No society committe type found!" });
                }
                return Ok(allCommitte);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });
            }
        }
        //get data by id
        [HttpGet]
        [Route("{id:int}")]
        public IActionResult getCommitteById(int id)
        {
            try
            {
                var committe = dbContext.SocietyCommitteMasters.Find(id);
                if (committe == null)
                {
                    return NotFound(new { message = "Society committe record not found." });
                }
                return Ok(committe);    
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }
        //Add Data
        [HttpPost]
        public IActionResult addCommittie(AddCommitteData addSocietyCommitte)
        {
            try
            {
                //if (addSocietyCommitte == null)
                //{
                //    return BadRequest(new { msg = "The value is null." });
                //}
                var committeEntity = new SocietyCommitteMaster
                {
                    CommitteName = addSocietyCommitte.CommitteName,
                    Description = addSocietyCommitte.Description,
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.SocietyCommitteMasters.Add(committeEntity);
                dbContext.SaveChanges();

                return Ok(new { message = "Society committe added successfully !" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        //Update data
        [HttpPut]
        [Route("updateSocietyCommitte/{id:int}")]
        public IActionResult updateCommitte(int id,UpdateCommitteData updateCommitteData)
        {
            try
            {
                var committe = dbContext.SocietyCommitteMasters.Find(id);
                if (committe == null)
                {
                    return NotFound(new { message = "Society Committe Data not found" });
                }
                committe.CommitteName = updateCommitteData.CommitteName;
                committe.Description = updateCommitteData.Description;
                committe.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = "Society Committe updated succesfully !" });
            }
            catch (Exception ex) {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        //Update status 
        [HttpPut]
        [Route("toggleStatus/{id:int}")]
        public IActionResult toggleCommitteStatus(int id)
        {
            try
            {
                var committe = dbContext.SocietyCommitteMasters.Find(id);
                if(committe == null)
                {
                    return NotFound(new { message = "Society Committe Data not found" });

                }
                if (committe.Status == "Active")
                {

                    committe.Status = "Block";
                }
                else
                {
                    committe.Status = "Active";
                }
                committe.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = $"Society committe status {committe.Status} successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

    }
}
