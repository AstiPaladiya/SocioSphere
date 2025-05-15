using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

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
//All API for members
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
                if(addData.Photo!=null)
                {
                    fileName = await fileService.uploadFile(addData.Photo, "uploadimage");
                }else
                {
                    fileName = null;
                }
                var comEntity = new ComplainMaster
                {
                    UserId = addData.UserId,
                    ComplainTypeId = addData.ComplainTypeId,
                    Priority = addData.Priority,
                    ComplainTitle = addData.ComplainTitle,
                    Description = addData.Description,
                    Photo = fileName,
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.ComplainMasters.Add(comEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Complain added successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpPut]
        [Route("updateComplain/{id:int}")]
        public async Task<IActionResult> updateComplain(int id,UpdateComplainData upData)
        {
            try
            {
                var comEntity = dbContext.ComplainMasters.FirstOrDefault(c=>c.Id==id && c.Status=="Pending");
                if (comEntity == null)
                {
                    return NotFound(new { message = "Complain not found!" });
                }
                string fileName;
                if (upData.Photo != null)
                {
                    if (!string.IsNullOrEmpty(comEntity.Photo))
                    {
                        var oldFilePath = Path.Combine("wwwroot/uploadimage", comEntity.Photo);

                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                        fileName = await fileService.uploadFile(upData.Photo, "uploadimage");
                        comEntity.Photo = fileName;
                    }
                }
                comEntity.UserId = upData.UserId;
                comEntity.ComplainTypeId = upData.ComplainTypeId;
                comEntity.Priority = upData.Priority;
                comEntity.ComplainTitle= upData.ComplainTitle;
                comEntity.Description= upData.Description;
                comEntity.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = "Complain updated successfully" });
            }
            catch (Exception ex) {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }

        }

        [HttpGet]
        [Route("{id:int}")]
        public IActionResult getComplainById(int id)
        {
            try
            {
                var comdata=dbContext.ComplainMasters.Include(ct=>ct.ComplainType).
                            Select(c =>new {
                                c.Id,
                                c.UserId,
                                c.ComplainTypeId,
                                c.ComplainTitle,
                                c.Description,
                                c.Priority,
                                c.Status,
                                complainType=c.ComplainType.ComplainName
                            }).FirstOrDefault(c=>c.Id==id);
                if(comdata==null)
                {
                    return NotFound();
                }
                return Ok(comdata);
            }catch(Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        [HttpGet]
        [Route("allAcceptedComplainForMember")]
        public IActionResult getAllAcceptedComplainForMember()
        {
            try { 
                    var userId = Request.Headers["userId"].ToString();
                int uId = int.Parse(userId);
                if(uId!=null)
                {
                    var comData= dbContext.ComplainMasters.Include(c => c.ComplainType).Include(u => u.User).Where(cs => cs.Status == "Pending" || cs.Status == "In Progress").Where(c => c.UserId == uId).
                    Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote, c.ActionTakenDueDate, username = c.User.FirstName + " " + c.User.LastName, comtype = c.ComplainType.ComplainName }).ToList();

                    if(comData==null)
                    {
                        return NotFound(new { message = "No Complain record found!" });
                    }
                    return Ok(comData);

                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        [HttpGet]
        [Route("allCompletedComplainForMember")]
        public IActionResult getAllCompletedComplainForMember()
        {
            try
            {
                var userId = Request.Headers["userId"].ToString();
                int uId = int.Parse(userId);
                if (uId != null)
                {
                    var comData = dbContext.ComplainMasters.Include(c => c.ComplainType).Include(u => u.User).Where(cs => cs.Status == "Completed").Where(c => c.UserId == uId).
                    Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote, c.ActionTakenDueDate, username = c.User.FirstName + " " + c.User.LastName, comtype = c.ComplainType.ComplainName }).ToList();

                    if (comData == null)
                    {
                        return NotFound(new { message = "No Complain record found!" });
                    }
                    return Ok(comData);

                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        [HttpGet]
        [Route("allRejectedComplainForMember")]
        public IActionResult getAllRejectedComplainForMember()
        {
            try
            {
                var userId = Request.Headers["userId"].ToString();
                int uId = int.Parse(userId);
                if (uId != null)
                {
                    var comData = dbContext.ComplainMasters.Include(c => c.ComplainType).Include(u => u.User).Where(cs => cs.Status == "Rejected").Where(c => c.UserId == uId).
                    Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote, c.ActionTakenDueDate, username = c.User.FirstName + " " + c.User.LastName, comtype = c.ComplainType.ComplainName }).ToList();

                    if (comData == null)
                    {
                        return NotFound(new { message = "No Complain record found!" });
                    }
                    return Ok(comData);

                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }

        //All Admin API
        //[Authorize]
        [HttpGet]
        [Route("allRejectedComplainForAdmin")]
        public IActionResult getAllComplainRejectedForAdmin()
        {
            try
            {
                var com=dbContext.ComplainMasters.Include(c=>c.ComplainType).Include(u=>u.User).Where(cs=>cs.Status=="Rejected").
                    Select(c=>new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status,c.AdminActionTakenNote,username=c.User.FirstName +" "+ c.User.LastName,comtype=c.ComplainType.ComplainName }).ToList();
                if(com==null) 
                { 
                    return NotFound(new {message="Complain record not found!"}); 
                } 
                return Ok(com);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        //[Authorize]
        [HttpGet]
        [Route("allAcceptedComplainForAdmin")]
        public IActionResult getAllComplainAcceptedForAdmin()
        {
            try
            {
                var com = dbContext.ComplainMasters.Include(c => c.ComplainType).Include(u => u.User).Where(cs => cs.Status == "Pending" || cs.Status=="In Progress").
                    Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote,c.ActionTakenDueDate, username = c.User.FirstName + "" + c.User.LastName, comtype = c.ComplainType.ComplainName }).ToList();
                if (com == null)
                {
                    return NotFound(new { message = "Complain record not found!" });
                }
                return Ok(com);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        //[Authorize]
        [HttpGet]
        [Route("allCompletedComplainForAdmin")]
        public IActionResult getAllComplainCompletedForAdmin()
        {
            try
            {
                var com = dbContext.ComplainMasters.Include(c => c.ComplainType).Include(u => u.User).Where(cs => cs.Status == "Completed" ).
                    Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote,c.ActionTakenDueDate, username = c.User.FirstName + " " + c.User.LastName, comtype = c.ComplainType.ComplainName }).ToList();
                if (com == null)
                {
                    return NotFound(new { message = "Complain record not found!" });
                }
                return Ok(com);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        //[Authorize]
        [HttpPut]
        [Route("complainRejected/{id:int}")]
        public IActionResult statusRejectedByAdmin(int id,UpdateComplainResponse upReData)
        {
            try
            {
                var com = dbContext.ComplainMasters.Find(id);
                if(com==null)
                {
                    return NotFound();
                }
                com.AdminActionTakenNote = upReData.AdminActionTakenNote;
                com.ActionTakenDueDate = null;
                com.Status = "Rejected";
                com.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = $"Complain status {com.Status} Successfuly" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }

        [HttpPut]
        [Route("complainAccepted/{id:int}")]
        public IActionResult updateComplainAccepted(int id,UpdateComplainResponse upReData)
        {
            try
            {
                var com = dbContext.ComplainMasters.Find(id);
                if (com == null)
                {
                    return NotFound();  
                }
                if (com.Status == "Pending")
                {
                    com.AdminActionTakenNote = upReData.AdminActionTakenNote;
                    com.ActionTakenDueDate = upReData.ActionTakenDueDate;
                    com.Status = "In Progress";
                    com.UpdatedAt = DateTime.UtcNow;
                }else if(com.Status=="In Progress")
                {
                    com.AdminActionTakenNote = upReData.AdminActionTakenNote;
                    com.ActionTakenDueDate = upReData.ActionTakenDueDate;
                    com.Status = "Completed";
                    com.UpdatedAt = DateTime.UtcNow;
                }
                dbContext.SaveChanges();
                return Ok(new { message = $"Complain status {com.Status} Successfuly" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }




    }
}
