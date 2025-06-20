using System.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using SocioSphere.Models.Entity;
using SocioSphere.Models.UserDataModels.AddUserData;

namespace SocioSphere.Controllers
{
    //localhost:5847/api/Admin
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable

        //contruct of this controller
        public AdminController(SociosphereContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        [Route("AdminRegister")]
        public IActionResult adminRegistration(AddAdminData adminData)
        {
            try
            {
                var emailexists = dbContext.UserMasters.FirstOrDefault(d => d.Email == adminData.Email);
                if (emailexists != null)
                {
                    return BadRequest(new { message = "Email already exists!" });
                }
                string hashPassword = BCrypt.Net.BCrypt.HashPassword(adminData.Password);
                var userEntity = new UserMaster()
                {
                    GroupId = 1,
                    FirstName = adminData.FirstName,
                    MiddleName = adminData.MiddleName,
                    LastName = adminData.LastName,
                    Email = adminData.Email,
                    Password = hashPassword,
                    PhoneNo = adminData.PhoneNo,
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.Add(userEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Admin Registered successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }
    }
}
