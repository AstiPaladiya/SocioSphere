using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocioSphere.Models.Entity;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgendaController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        public AgendaController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult getAllAgenda()
        {
            try
            {
                var agenda = dbContext.Agenda.Include(a => a.SocietyMeeting).
                    Include(a => a.UserAgenda).Select(a => new
                    {
                        a.Id,
                        a.AgendaDescription,
                        a.ActionTakenNote,
                        a.Priority,
                        a.Status,
                        a.SocietyMeetingId,
                        societymeetingname = a.SocietyMeeting.MeetingName,
                        a.UserAgendaId,
                        username = a.UserAgenda.FirstName + " " + a.UserAgenda.LastName
                    }).ToList();
                if (agenda == null || !agenda.Any())
                {
                    return NotFound(new { message = "No agenda recoud found!" });
                }

                return Ok(agenda);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });
            }
        }


        [Authorize]
        [HttpPost]
        [Route("addAgendaMember")]
        public IActionResult addAgendaByUser(AddAgendaData adData)
        {
            try
            {
                //var userClaim = User.FindFirst("UserId");
                //if (userClaim == null)
                //{
                //    return Unauthorized(new { message = "User not found in token." });
                //}

                //int userId = int.Parse(userClaim.Value);

                var agEntity = new Agendum
                {
                    SocietyMeetingId = adData.SocietyMeetingId,
                    UserAgendaId =adData.UserAgendaId,
                    AgendaDescription = adData.AgendaDescription,
                    Priority = adData.Priority,
                    Status = "Pending", 
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.Agenda.Add(agEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Agenda added succesfully !" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }
        }

        //[HttpPut]
        //[Route("updateAgendaByMember/{id:int}")]
        //public IActionResult updateAgendaByUser(int id,UpdateAgendaData upData)
        //{
              
        //}
    }
}
