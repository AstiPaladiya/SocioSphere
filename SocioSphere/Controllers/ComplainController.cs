using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Ocsp;
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
        private readonly IEmailService _emailService;

        //contruct of this controller
        public ComplainController(SociosphereContext dbContext,IFileService fileService, IEmailService emailService)
        {
            this.dbContext = dbContext;
            this.fileService = fileService;
            _emailService = emailService;
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
                var comdata = dbContext.ComplainMasters
          .Include(ct => ct.ComplainType)
          .Include(u => u.User) // Fetch the member's details
          .Select(c => new {
              c.Id,
              c.UserId,
              c.ComplainTypeId,
              c.ComplainTitle,
              c.Description,
              c.Priority,
              c.Status,
              photo = !string.IsNullOrEmpty(c.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{c.Photo}" : null,
              complainType = c.ComplainType.ComplainName,
              c.AdminActionTakenNote,
              ActionTakenDueDate = c.ActionTakenDueDate.HasValue ? c.ActionTakenDueDate.Value.ToString("dd MMMM yyyy") : null,
              CreatedAt = c.CreatedAt.HasValue ? c.CreatedAt.Value.ToString("dd MMMM yyyy, hh:mm tt") : null,
              UpdatedAt = c.UpdatedAt.HasValue ? c.UpdatedAt.Value.ToString("dd MMMM yyyy, hh:mm tt") : null,
              memberProfilePic = !string.IsNullOrEmpty(c.User.ProfilePhoto) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{c.User.ProfilePhoto}" : null,
              adminProfilePic = dbContext.UserMasters
                  .Where(u => u.GroupId == 1) // Filter admin by GroupId and AdminId
                  .Select(u => !string.IsNullOrEmpty(u.ProfilePhoto) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{u.ProfilePhoto}" : null)
                  .FirstOrDefault()
          })
          .FirstOrDefault(c => c.Id == id);

                if (comdata==null)
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
        [Route("allComplainForMember")]
        public IActionResult getAllComplainForMember()
        {
            try { 
                    var userId = Request.Headers["userId"].ToString();
                int uId = int.Parse(userId);
                    var comData= dbContext.ComplainMasters.Include(c => c.ComplainType).Include(u => u.User).Where(c => c.UserId == uId).OrderByDescending(c=>c.CreatedAt).
                    Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote, c.ActionTakenDueDate, comtype = c.ComplainType.ComplainName }).ToList();

                    if(comData==null)
                    {
                        return NotFound(new { message = "No Complain record found!" });
                    }
                    return Ok(comData);
    
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        [HttpGet]
        [Route("allComplainForMemberBytype/{id:int}")]
        public IActionResult getAllComplainForMemberByType(int id)
        {
            try
            {
                var userId = Request.Headers["userId"].ToString();
                int uId = int.Parse(userId);
                var comData = dbContext.ComplainMasters.Include(c => c.ComplainType).Include(u => u.User).Where(c => c.UserId == uId).OrderByDescending(c => c.CreatedAt).Where(c=>c.ComplainTypeId==id).
                Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote, c.ActionTakenDueDate, comtype = c.ComplainType.ComplainName }).ToList();

                if (comData == null)
                {
                    return NotFound(new { message = "No Complain record found!" });
                }
                return Ok(comData);

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        //[HttpGet]
        //[Route("allCompletedComplainForMember")]
        //public IActionResult getAllCompletedComplainForMember()
        //{
        //    try
        //    {
        //        var userId = Request.Headers["userId"].ToString();
        //        int uId = int.Parse(userId);
        //        if (uId != null)
        //        {
        //            var comData = dbContext.ComplainMasters.Include(c => c.ComplainType).Include(u => u.User).Where(cs => cs.Status == "Completed").Where(c => c.UserId == uId).
        //            Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote, c.ActionTakenDueDate, username = c.User.FirstName + " " + c.User.LastName, comtype = c.ComplainType.ComplainName }).ToList();

        //            if (comData == null)
        //            {
        //                return NotFound(new { message = "No Complain record found!" });
        //            }
        //            return Ok(comData);

        //        }
        //        else
        //        {
        //            return NotFound();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error: {ex.Message}");
        //        return StatusCode(500, new { message = "Something went wrong.Please try again!" });
        //    }
        //}
        //[HttpGet]
        //[Route("allRejectedComplainForMember")]
        //public IActionResult getAllRejectedComplainForMember()
        //{
        //    try
        //    {
        //        var userId = Request.Headers["userId"].ToString();
        //        int uId = int.Parse(userId);
        //        if (uId != null)
        //        {
        //            var comData = dbContext.ComplainMasters.Include(c => c.ComplainType).Include(u => u.User).Where(cs => cs.Status == "Rejected").Where(c => c.UserId == uId).
        //            Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote, c.ActionTakenDueDate, username = c.User.FirstName + " " + c.User.LastName, comtype = c.ComplainType.ComplainName }).ToList();

        //            if (comData == null)
        //            {
        //                return NotFound(new { message = "No Complain record found!" });
        //            }
        //            return Ok(comData);

        //        }
        //        else
        //        {
        //            return NotFound();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error: {ex.Message}");
        //        return StatusCode(500, new { message = "Something went wrong.Please try again!" });
        //    }
        //}

        //All Admin API
        //[Authorize]
        [HttpGet]
        [Route("allRejectedComplainForAdmin")]
        public IActionResult getAllComplainRejectedForAdmin()
        {
            try
            {
                var com=dbContext.ComplainMasters.Include(c=>c.ComplainType).Include(u=>u.User).Where(cs=>cs.Status=="Rejected").
                    Select(c=>new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status,c.AdminActionTakenNote, ActionTakenDueDate = c.ActionTakenDueDate.Value.ToString("dd-MM-yyyy"),username=c.User.FirstName +" "+ c.User.LastName,comtype=c.ComplainType.ComplainName, complainDate = c.CreatedAt.Value.ToString("dd-MM-yyyy") }).ToList();
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
                    Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote,
                        ActionTakenDueDate = c.ActionTakenDueDate.Value.ToString("dd-MM-yyyy"), username = c.User.FirstName + " " + c.User.LastName, comtype = c.ComplainType.ComplainName,complainDate=c.CreatedAt.Value.ToString("dd-MM-yyyy"),
                                                           photo = !string.IsNullOrEmpty(c.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{c.Photo}" : null,
                    }).ToList();
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
                    Select(c => new { c.Id, c.UserId, c.ComplainTypeId, c.ComplainTitle, c.Description, c.Priority, c.Status, c.AdminActionTakenNote,ActionTakenDueDate=c.ActionTakenDueDate.Value.ToString("dd-MM-yyyy"), username = c.User.FirstName + " " + c.User.LastName, comtype = c.ComplainType.ComplainName, complainDate = c.CreatedAt.Value.ToString("dd-MM-yyyy") }).ToList();
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
        public async Task<IActionResult> statusRejectedByAdmin(int id,UpdateComplainResponse upReData)
        {
            try
            {
                var com = dbContext.ComplainMasters.Find(id);
                var user = dbContext.ComplainMasters.Include(u => u.User).FirstOrDefault(c => c.Id == id);
                string actiontaken = upReData.AdminActionTakenNote;
                string toEmail = "";
                string subject = "";
                string message = "";
                if (com==null)
                {
                    return NotFound();
                }
                com.AdminActionTakenNote = upReData.AdminActionTakenNote;
                com.ActionTakenDueDate = DateOnly.FromDateTime(DateTime.UtcNow);
                com.Status = "Rejected";
                com.UpdatedAt = DateTime.UtcNow;
                toEmail = user.User.Email;
                subject = "Your Complaint Has Been Rejected - SocioSphere";
                message = "<h2>Hello, " + user.User.FirstName + " " + user.User.LastName + "</h2>" +
                    "<p>We regret to inform you that your complain has been <strong>rejected</strong>.</p>" +
                    "<p><b>Reason for Rejection:</b> " + upReData.AdminActionTakenNote + "</p>" +
                    "<p>If you have any questions or need further clarification, please contact support.</p>" +
                    "<br/><p>Regards,<br/>SocioSphere Admin Team</p>";
                await _emailService.sendMailAsync(toEmail, subject, message);
                dbContext.SaveChanges();
                return Ok(new { message = $"Complain  {com.Status} and mail sent successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }

        [HttpPut]
        [Route("complainAccepted/{id:int}")]
        public async Task<IActionResult> updateComplainAccepted(int id,UpdateComplainResponse upReData)
        {
            try
            {
                var com = dbContext.ComplainMasters.Find(id);
                var user = dbContext.ComplainMasters.Include(u => u.User).FirstOrDefault(c => c.Id == id);
                string actiontaken = upReData.AdminActionTakenNote;
                string duedate = upReData.ActionTakenDueDate.Value.ToString("dd-MM-yyyy");
                string toEmail = "";
                string subject = "";
                string message = "";
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
                    toEmail = user.User.Email;
                    subject = "Your Complain Has Been Accepted - SocioSphere";
                    message = "<h2>Hello, " + user.User.FirstName + " " + user.User.LastName + "</h2>" +
                        "<p>Your complain has been <strong>accepted</strong> and is now <b>In Progress</b>.</p>" +
                        "<p><b>Action Taken:</b> " + actiontaken + "</p>" +
                        "<p><b>Expected Resolution Date:</b> " + duedate + "</p>" +
                        "<p>We are working to resolve your issue as soon as possible. Thank you for your patience.</p>" +
                        "<br/><p>Regards,<br/>SocioSphere Admin Team</p>";
                }
                else if(com.Status=="In Progress")
                {
                    com.AdminActionTakenNote = upReData.AdminActionTakenNote;
                    com.ActionTakenDueDate = upReData.ActionTakenDueDate;
                    com.Status = "Completed";
                    com.UpdatedAt = DateTime.UtcNow;
                    toEmail = com.User.Email;
                    subject = "Your complain has been solved - SocioSphere";
                    message = "<h2>Hello, " + com.User.FirstName + " " + com.User.LastName + "</h2>" +
                        "<p>Your complaint has been <strong>solved</strong> and is now marked as <b>Completed</b>.</p>" +
                        "<p><b>Action Taken:</b> " + actiontaken + "</p>" +
                        "<p><b>Solved Date:</b> " + duedate + "</p>" +
                        "<p>If you have any further concerns, please let us know.</p>" +
                        "<br/><p>Regards,<br/>SocioSphere Admin Team</p>";
                }
                await _emailService.sendMailAsync(toEmail, subject, message);
                dbContext.SaveChanges();
                return Ok(new { message = $"Complain status {com.Status} and Mail sent successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }

        [HttpGet]
        [Route("getActiveComplainType")]
        public IActionResult getAgencyType()
        {
            try
            {
                var type = dbContext.ComplainTypes.
                    Where(e => e.Status == "Active").
                    Select(e => new
                    {
                        e.Id,
                        e.ComplainName
                    }).ToList();
                return Ok(type);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }


    }
}
