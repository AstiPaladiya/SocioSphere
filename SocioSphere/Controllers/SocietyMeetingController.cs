using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SocietyMeetingController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        private readonly IFileService _fileService;
        public SocietyMeetingController(SociosphereContext dbContext, IFileService fileService)
        {
            this.dbContext = dbContext;
            _fileService = fileService;
        }

        [HttpGet]
        public IActionResult getAllSocietyMeeting()
        {
            try
            {
                var soc = dbContext.SocietyMeetings.
                    Select(s => new
                    {
                        s.Id,
                        s.MeetingName,
                        s.Notice,
                        s.Date,
                        s.Time,
                        photo = !string.IsNullOrEmpty(s.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{s.Photo}" : null,
                        s.Location,
                        s.Status
                    }).ToList();
                if (soc == null || !soc.Any())
                {
                    return NotFound(new { message = "Society meeting record not found" });
                }
                return Ok(soc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }

        }
        [HttpGet]
        [Route("{id:int}")]
        public IActionResult getSocietyMeetingById(int id)
        {
            try
            {

                var soc = dbContext.SocietyMeetings.Find(id);

                if (soc == null)
                {
                    return NotFound(new { message = "Society meeting record not found!" });
                }
                return Ok(soc);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpPost]
        public async Task<IActionResult> addSocietyMeeting(AddSocietyMeetingData socData)
        {
            try
            {

                string fileName = await _fileService.uploadFile(socData.Photo, "uploadimage");
                var socEntity = new SocietyMeeting
                {

                    MeetingName = socData.MeetingName,
                    Notice = socData.Notice,
                    Date = socData.Date,
                    Time = socData.Time,
                    Photo = fileName,
                    Location = socData.Location,
                    EndDate = socData.EndDate,
                    Status = "Scheduled",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = null
                };
                dbContext.SocietyMeetings.Add(socEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Society meeting record added succesfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        [HttpPut]
        [Route("updateMeeting/{id:int}")]
        public async Task<IActionResult> updateSocietyMeetimg(int id, UpdateSocietyMeetingData socData)
        {
            try
            {

                var checkData = dbContext.SocietyMeetings.Find(id);
                if (checkData == null)
                {
                    return NotFound(new { message = "Society meeting record not found" });
                }
                if (socData.Photo != null)
                {
                    if (!string.IsNullOrEmpty(checkData.Photo))
                    {
                        var oldFilePath = Path.Combine("wwwroot/uploadimage", checkData.Photo);
                        if (System.IO.File.Exists(oldFilePath))
                        {
                            System.IO.File.Delete(oldFilePath);
                        }
                    }
                    string fileName = await _fileService.uploadFile(socData.Photo, "uploadimage");
                    checkData.Photo = fileName;
                }

                checkData.MeetingName = socData.MeetingName;
                checkData.Notice = socData.Notice;
                checkData.Date = socData.Date;
                checkData.Time = socData.Time;

                checkData.Location = socData.Location;
                checkData.EndDate = socData.EndDate;
                checkData.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = "Soiety meeting record updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }

        }

        [HttpPut]
        [Route("toggleStatus/{id:Int}")]
        public IActionResult toggleSocietyStatus(int id, [FromBody] string status)
        {
            try
            {
                var checkData = dbContext.SocietyMeetings.Find(id);
                if (checkData == null)
                {
                    return NotFound(new { message = "Society meeting record not found" });
                }
                checkData.Status = status;
                checkData.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = $"Society meeting status {checkData.Status} successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }

    }
}
