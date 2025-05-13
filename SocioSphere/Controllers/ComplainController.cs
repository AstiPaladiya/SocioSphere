using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplainController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable
        private readonly IFileService fileService;
        //contruct of this controller
        public ComplainController(SociosphereContext dbContext,IFileService fileService)
        {
            this.dbContext = dbContext;
            this.fileService = fileService;
        }

        [HttpGet]
        [Route("getAllComplainType")]
        public IActionResult getAllComplainType()
        {
            try
            {
                var comType = dbContext.ComplainTypes.Where(t => t.Status == "Active").Select(t=> new
                {
                    t.Id,
                    t.ComplainName
                }).ToList();
                if (comType == null)
                {
                    return NotFound();
                }
                return Ok(comType);
            }
            catch (Exception ex) {
            
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
              
            }
        }
        [HttpPost]
        public async Task<IActionResult> addComplain(AddComplainData addData)
        {
            try
            {
                string fileName;
                if(addData!=null)
                {
                    fileName = await fileService.uploadFile(addData.Photo, "uploadimage");
                }
                var comEntity = new ComplainMaster
                {
                    UserId = addData.UserId,
                    ComplainTypeId = addData.ComplainTypeId,
                    Priority = addData.Priority,
                    ComplainTitle = addData.ComplainTitle,
                    Description = addData.Description,
                    //Photo = addData.Photo,
                    Status = "Prnding",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

    }
}
