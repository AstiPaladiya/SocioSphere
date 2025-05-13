using System.Security.Cryptography;
using System.Text;
using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;

namespace SocioSphere.Controllers
{
    //localhost:5847/api/Member
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class MemberController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        //contruct of this controller
        public MemberController(SociosphereContext dbContext, IConfiguration config,IEmailService emailService)
        {
            this.dbContext = dbContext;
            this._config = config;
            this._emailService = emailService;
        }



        [HttpPost]
        [Route("MemberRegister")]
        public async Task<IActionResult> memberRegistration(AddMemberData memberData)
        {
            try
            {
                var emailexists = dbContext.UserMasters.FirstOrDefault(d => d.Email == memberData.Email);
                if (emailexists != null)
                {
                    return BadRequest(new { message = "Email already registered!" });
                }
                string generatedPassword = GenerateRandomPassword(7);
                Console.WriteLine(generatedPassword);
                string hashPassword = BCrypt.Net.BCrypt.HashPassword(generatedPassword);
                var newuserEntity = new UserMaster()
                {
                    GroupId = 2,
                    FirstName = memberData.FirstName,
                    MiddleName = memberData.MiddleName,
                    LastName = memberData.LastName,
                    Email = memberData.Email,
                    Password = hashPassword,
                    PhoneNo = memberData.PhoneNo,
                    Gender = memberData.Gender,
                    SquarfootSize = memberData.SquarfootSize,
                    LivingDate = memberData.LivingDate,
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.Add(newuserEntity);
                String toEmail = memberData.Email;
                String subject = "Registration Successful";
                String message = "<h2>Welcome to SocioSphere, " + memberData.FirstName +" "+ memberData.LastName + "</h2>" +
                    "<br/><p>Your account has been successfully created in our system.You can login using below Credentials</p><br/>" +
                    "<p><b>Login Credentials</b></p>"+
                    "<table><tr><td>Email:</td><td>" + memberData.Email + "</td></tr>" +
                    "<tr><td>Password:</td><td>" + generatedPassword + "</td></tr></table>";
                await _emailService.sendMailAsync(toEmail, subject, message);
                dbContext.SaveChanges();
                int userId = newuserEntity.Id;
                var userpersonaldetail = new UserPersonalDetail()
                {
                    UserId = userId,
                    FlatNo = memberData.FlatNo,
                };
                dbContext.UserPersonalDetails.Add(userpersonaldetail);
                dbContext.SaveChanges();
             
                return Ok(new { message = "Member Registered successfully", password = generatedPassword });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }
        [HttpPut]
        [Route("toggleStatus/{id:int}")]
        public IActionResult toggleMemberStatus(int id)
        {
            try
            {
                var member = dbContext.UserMasters.Find(id);

                if (member.Status == "Active")
                {
                    member.Status = "Block";

                }
                else
                {
                    member.Status = "Active";
                }
                member.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();

                return Ok(new { message = $"Member status {member.Status} successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpGet]
        [Route("GetAllMembers")]
        public IActionResult GetAllMembers()
        {
            try
            {
                var members = dbContext.UserMasters
                    .Where(u => u.GroupId == 2)
                    .Select(u => new
                    {
                        u.Id,
                        u.FirstName,
                        u.MiddleName,
                        u.LastName,
                        u.Email,
                        u.PhoneNo,
                        u.Gender,
                        u.SquarfootSize,
                        u.LivingDate,
                        u.Status,
                        u.CreatedAt,
                        u.UpdatedAt
                    })
                    .ToList();

                return Ok(members);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }


        [HttpGet]
        [Route("{id:int}")]
        public IActionResult getAllMemberById(int id)
        {
            try
            {
                var member = dbContext.UserMasters.Find(id);
                if (member == null)
                {
                    return NotFound(new { message = "Member record not found." });
                }
                return Ok(member);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }
        //        Response body for vimala member
        //Download
        //{
        //  "message": "Member Registered successfully",
        //  "password": "#$1xKoX"
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
