using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplaintypeController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable

        //contruct of this controller
        public ComplaintypeController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult getAllComType()
        {
            try
            {
                var allCom = dbContext.ComplainTypes.ToList();
                if (allCom == null || !allCom.Any())
                {
                    return NotFound(new { message = "No Complain type found!" });
                }
                return Ok(allCom);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });
            }
        }
        [HttpGet]
        [Route("ComplainTypeById/{id:int}")]
        public IActionResult getComTypeById(int id)
        {
            try
            {
                var com = dbContext.ComplainTypes.Find(id);
                if (com == null)
                {
                    return NotFound(new { message = "Complain record not found." });
                }
                return Ok(com);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }
        [HttpPost]
        public IActionResult addComplainType(AddComplainTypeData addComplain)
        {
            try
            {
                //if (addSocietyCommitte == null)
                //{
                //    return BadRequest(new { msg = "The value is null." });
                //}
                var comEntity = new ComplainType
                {
                    ComplainName=addComplain.ComplainName,
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.ComplainTypes.Add(comEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Complain Type added successfully !" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpPut]
        [Route("{id:int}")]
        public IActionResult updateComplainType(int id, UpdateComplainTypeData upCom)
        {
            try
            {
                var com = dbContext.ComplainTypes.Find(id);
                if (com == null)
                {
                    return NotFound(new { message = "Complain type Data not found" });
                }
               com.ComplainName = upCom.ComplainName;
                com.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = "Complain type updated succesfully !" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        //Update status 
        [HttpPut]
        [Route("toggleStatus/{id:int}")]
        public IActionResult toggleComplainStatus(int id)
        {
            try
            {
                var com = dbContext.ComplainTypes.Find(id);
                if (com == null)
                {
                    return NotFound(new { message = "Complain type not found" });

                }
                if (com.Status == "Active")
                {
                    com.Status = "Block";
                }
                else
                {
                    com.Status = "Active";
                }
                com.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = $"Complain type status {com.Status} successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

    }
}
