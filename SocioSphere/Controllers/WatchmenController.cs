using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WatchmenController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        private readonly IEmailService _emailService;
        public WatchmenController(SociosphereContext dbContext, IEmailService emailService)
        {
            this.dbContext = dbContext;
            this._emailService = emailService;
        }
        [HttpPost]
        [Route("watchmenRegister")]
        public async Task<IActionResult> watchmenRegistration(AddWatchmenData watchmenData)
        {
            try
            {
                var emailExist = dbContext.UserMasters.FirstOrDefault(u => u.Email == watchmenData.Email);

                if (emailExist != null)
                {
                    return BadRequest(new { message = "Email already registeres!" });
                }
                string generatePassword = GenerateRandomPassword(7);
                string hashPassword = BCrypt.Net.BCrypt.HashPassword(generatePassword);
                var newUserEntity = new UserMaster()
                {
                    GroupId = 3,
                    FirstName = watchmenData.FirstName,
                    MiddleName = watchmenData.MiddleName,
                    LastName = watchmenData.LastName,
                    Email = watchmenData.Email,
                    Password = hashPassword,
                    PhoneNo = watchmenData.PhoneNo,
                    Gender = watchmenData.Gender,
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.Add(newUserEntity);
                String toEmail = watchmenData.Email;
                String subject = "Registration Successful";
                String message = "<h2>Welcome to SocioSphere, " + watchmenData.FirstName + " " + watchmenData.LastName + "</h2>" +
                    "<br/><p>Your account has been successfully created in our system.You can login using below Credentials</p><br/>" +
                    "<p><b>Login Credentials</b></p>" +
                    "<table><tr><td>Email:</td><td>" + watchmenData.Email + "</td></tr>" +
                    "<tr><td>Password:</td><td>" + generatePassword + "</td></tr></table>";
                await _emailService.sendMailAsync(toEmail, subject, message);
                dbContext.SaveChanges();
                int userId = newUserEntity.Id;
                var userpersonaldetail = new UserPersonalDetail()
                {
                    UserId = userId,
                    ShiftStartTime = watchmenData.ShiftStartTime,
                    ShiftEndTime = watchmenData.ShiftEndTime,
                    JoiningDate = watchmenData.JoiningDate,
                    Salary = watchmenData.Salary,

                };
                dbContext.Add(userpersonaldetail);
                dbContext.SaveChanges();
                return Ok(new { message = "Watchmen registred successfully", password = generatePassword });
            }catch(Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        [HttpGet]
        [Route("GetAllWatchmen")]
        public IActionResult GetAllWatchmen()
        {
            try
            {
                var watchmenDetails = (from user in dbContext.UserMasters
                                       join personal in dbContext.UserPersonalDetails
                                       on user.Id equals personal.UserId
                                       where user.GroupId == 3
                                       select new
                                       {
                                           user.Id,
                                           user.FirstName,
                                           user.MiddleName,
                                           user.LastName,
                                           user.Email,
                                           user.PhoneNo,
                                           user.Gender,
                                           user.Status,
                                           user.CreatedAt,
                                           user.UpdatedAt,
                                           personal.ShiftStartTime,
                                           personal.ShiftEndTime,
                                           personal.JoiningDate,
                                           personal.Salary
                                       }).ToList();

                return Ok(watchmenDetails);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }

        [HttpGet]
        [Route("toggleStatus/{id:int}")]
        public IActionResult toggleWatchmenStatus(int id)
        {
            try
            {
                var watchmen = dbContext.UserMasters.Find(id);

                if (watchmen.Status == "Active")
                {
                    watchmen.Status = "Block";

                }
                else
                {
                    watchmen.Status = "Active";
                }
                watchmen.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();

                return Ok(new { message = $"Watchmen status {watchmen.Status} successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        //        {
        //  "message": "Watchmen registred successfully",
        //  "password": "M78W3gN"
        //}
        [NonAction]
        public string GenerateRandomPassword(int length)
        {
            try
            {
                const string validChars = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
                StringBuilder password = new StringBuilder();

                byte[] randomBytes = new byte[length];
                RandomNumberGenerator.Fill(randomBytes);
                for (int i = 0; i < length; i++)
                {
                    int index = randomBytes[i] % validChars.Length;
                    password.Append(validChars[index]);
                }

                return password.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Password Generation Error: {ex.Message}");
                return "Default@123";
            }
        }
    
    }
}
