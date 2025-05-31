using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Versioning;
using SocioSphere.Models.Entity;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AgencyContactController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        public AgencyContactController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult getAllAgencyContact()
        {
            try
            {
                var contact = from a in dbContext.AgencyContacts
                              join agencyType in dbContext.AgencyMasters 
                              on a.AgencyTypeId equals agencyType.Id
                              where agencyType.Status=="Active"
                              select new
                              {
                                  a.Id,
                                  a.AgencyTypeId,
                                  a.ContactPersonName,
                                  a.Location,
                                  a.EmailId,
                                  a.ContactNo,
                                  a.AlternateContactNo,
                                  agencytype = agencyType.AgencyTypeName
                              };
                if (contact == null || !contact.Any())
                {
                    return NotFound(new { message = "Agency contact not found!" });
                }
                return Ok(contact);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }        
        }
        [HttpGet]
        [Route("{id:int}")]
        public IActionResult getAgencyContactById(int id)
        {
            try
            {
                var agency =    dbContext.AgencyContacts.Include(a => a.AgencyType).Where(a=>a.Id==id).
                    Select(a=>new
                    {
                        a.AgencyTypeId,
                        a.ContactPersonName,
                        a.Location,
                        a.EmailId,
                        a.ContactNo,
                        a.AlternateContactNo,
                        agencytype = a.AgencyType.AgencyTypeName
                    }).FirstOrDefault();
                if (agency == null)
                {
                    return NotFound(new { message = "Agency contact not found!" });

                }
                return Ok(agency);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpGet]
        [Route("agencyContactByType/{id:int}")]
        public IActionResult getAgencyContactByAgencTypeId(int id)
        {
            try
            {
                var agency = dbContext.AgencyContacts.Include(a => a.AgencyType).Where(a => a.AgencyTypeId == id).
                    Select(a => new
                    {
                        a.AgencyTypeId,
                        a.ContactPersonName,
                        a.Location,
                        a.EmailId,
                        a.ContactNo,
                        a.AlternateContactNo,
                        agencytype = a.AgencyType.AgencyTypeName
                    }).ToList();
                if (agency == null)
                {
                    return NotFound(new { message = "Agency contact not found!" });

                }
                return Ok(agency);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        //Add Data
        [HttpPost]
        public IActionResult addAgencyContact(AddAgencyContactData contactData)
        {
            try
            {
                //var typeExists = dbContext.AgencyMasters.Any(e => e.Id == contactData.AgencyTypeId);
                //if (!typeExists)
                //{
                //    return BadRequest(new { message = "Invalid Agency type" });
                //}

                var contact = new AgencyContact
                {
                   AgencyTypeId = contactData.AgencyTypeId,
                   ContactPersonName = contactData.ContactPersonName,
                   Location = contactData.Location,
                   EmailId = contactData.EmailId,
                   ContactNo= contactData.ContactNo,
                   AlternateContactNo= contactData.AlternateContactNo,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.AgencyContacts.Add(contact);
                dbContext.SaveChanges();

                return Ok(new { message = "Agency contact added successfully !" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpPut]
        [Route("updateAgencyContact/{id:int}")]
        public IActionResult updateAgencyContact(int id, UpdateAgencyContactData contactData)
        {
            try
            {
                var contact = dbContext.AgencyContacts.Find(id);
                if (contact == null)
                {
                    return NotFound(new { message = "Agency contact not found!" });
                }
                var typeId = dbContext.AgencyMasters.Any(e => e.Id == contactData.AgencyTypeId);
                if(!typeId)
                {
                    return BadRequest(new {message="Invalid Agency type" });
                }
                contact.AgencyTypeId= contactData.AgencyTypeId;
                contact.ContactPersonName= contactData.ContactPersonName;
                contact.Location= contactData.Location;
                contact.EmailId= contactData.EmailId;
                contact.ContactNo = contactData.ContactNo;
                contact.AlternateContactNo= contactData.AlternateContactNo;
                contact.UpdatedAt= DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = "Agency contact updated succesfully !" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpGet]
        [Route("getActiveAgencyType")]
        public IActionResult getAgencyType()
        {
            try
            {
                var type = dbContext.AgencyMasters.
                    Where(e => e.Status == "Active").
                    Select(e => new
                    {
                        e.Id,
                        e.AgencyTypeName
                    }).ToList();
                return Ok(type);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpDelete]
        [Route("deleteAgencyContact/{id:int}")]
        public IActionResult deleteAgencyContact(int id)
        {
            try
            {
                var galleryData = dbContext.AgencyContacts.Find(id);
                if (galleryData == null)
                {
                    return NotFound(new { message = "Agency contact record not found!" });
                }
               
                dbContext.AgencyContacts.Remove(galleryData);
                dbContext.SaveChanges();
                return Ok(new { message = "Agency contact record deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }

        }
    }
}
