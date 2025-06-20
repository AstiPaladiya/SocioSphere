using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;
using System.Security.Cryptography;
using System.Text;

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
        private readonly IFileService fileService;

        //contruct of this controller
        public MemberController(SociosphereContext dbContext, IConfiguration config,IEmailService emailService, IFileService fileService)
        {
            this.dbContext = dbContext;
            this._config = config;
            this._emailService = emailService;
            this.fileService = fileService;
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
        public async Task<IActionResult> toggleMemberStatus(int id, [FromBody]toggleStatus req)
        {
            try
            {
                var member = dbContext.UserMasters.Find(id);
                string reason = req.reason;
                string toEmail = "";
                string subject = "";
                string message = "";
                if (member.Status == "Active")
                {
                    member.Status = "Block";
                     toEmail = member.Email;
                     subject = "Your SocioSphere  account has been blocked";
                     message = "<h2>Hello, " + member.FirstName + " " + member.LastName + "</h2>" +
                        "<p>Your account has been <strong>blocked</strong>.</p>" +
                        "<p><b>Reason: </b>" + reason + "</p> " +
                        "<p>If you believe this is a mistake, please contact support.</p>";
                }
                else
                {
                    member.Status = "Active";
                    toEmail = member.Email;
                     subject = "Your SocioSphere  account has been Activated";
                     message = "<h2>Hello, " + member.FirstName + " " + member.LastName + "</h2>" +
                        "<p>Your account has been <strong>activated</strong>.</p>" +
                        "<p><b>Reason: </b>" + reason + "</p> " +
                        "<p>You can now log in and use the platform.</p>";

               

                }
                member.UpdatedAt = DateTime.UtcNow;
                await _emailService.sendMailAsync(toEmail, subject, message);
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
                var members = (from u in dbContext.UserMasters 
                               join up in dbContext.UserPersonalDetails on  u.Id equals up.UserId
                               where u.GroupId==2
                               select new
                               {
                                   u.Id,
                                   u.FirstName,
                                   u.MiddleName,
                                   u.LastName,
                                   u.Email,
                                   u.PhoneNo,
                                   u.Gender,
                                   u.SquarfootSize,
                                   LivingDate = u.LivingDate.Value.ToString("dd-MM-yyyy"),

                                   u.Status,
                                   u.CreatedAt,
                                   u.UpdatedAt,
                                   up.FlatNo
                               }).ToList();
                    
                    //dbContext.UserMasters.Include(u=>u.UserPersonalDetails)
                    //.Where(u => u.GroupId == 2).OrderByDescending(u=>u.CreatedAt).AsEnumerable()
                    //.Select(u => new
                    //{
                    //    u.Id,
                    //    u.FirstName,
                    //    u.MiddleName,
                    //    u.LastName,
                    //    u.Email,
                    //    u.PhoneNo,
                    //    u.Gender,
                    //    u.SquarfootSize,
                    //    LivingDate = u.LivingDate.Value.ToString("dd-MM-yyyy"),
                        
                    //    u.Status,
                    //    u.CreatedAt,
                    //    u.UpdatedAt,
                    //    FlatNo = u.UserPersonalDetails
                    //})
                    //.ToList();
               

                return Ok(members);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }
        [HttpPut]
        [Route("updateMember/{id:int}")]
        public async Task<IActionResult> updateMember(int id, UpdateMemberData upData)
        {
            try
            {
                var comEntity = dbContext.UserMasters.FirstOrDefault(c => c.Id == id );
                if (comEntity == null)
                {
                    return NotFound(new { message = "User not found!" });
                }
                var userFlat=dbContext.UserPersonalDetails.FirstOrDefault(u=>u.UserId==id);
                if (userFlat == null)
                {
                    return NotFound(new { message = "User personal detail not found!" });
                }
                string fileName = comEntity.ProfilePhoto;
                if (upData.ProfilePhoto != null)
                {
                    fileName = await fileService.uploadFile(upData.ProfilePhoto, "uploadimage");
                }
                string anotherproof = userFlat.AnotherIdProof;
                if(upData.AnotherIdProof != null)
                {
                anotherproof = await fileService.uploadFile(upData.AnotherIdProof, "uploadimage");
                }


                comEntity.FirstName=upData.FirstName != null ?upData.FirstName : comEntity.FirstName;
                comEntity.MiddleName = upData.MiddleName != null ? upData.MiddleName : comEntity.MiddleName;
                comEntity.LastName=upData.LastName != null ? upData.LastName : comEntity.LastName;
                comEntity.ProfilePhoto = fileName ;
                comEntity.Address = upData.Address != null ? upData.Address : comEntity.Address;
                comEntity.Email=upData.Email != null ? upData.Email : comEntity.Email;
                comEntity.PhoneNo=upData.PhoneNo != null ? upData.PhoneNo : comEntity.PhoneNo;
                comEntity.Gender=upData.Gender != null ? upData.Gender : comEntity.Gender;
                comEntity.SquarfootSize=upData.SquarfootSize != null ? upData.SquarfootSize : comEntity.SquarfootSize;
                comEntity.LivingDate = upData.LivingDate != null ? upData.LivingDate : comEntity.LivingDate;
                comEntity.TotalFamilyMember=upData.TotalFamilyMember != null ? upData.TotalFamilyMember : comEntity.TotalFamilyMember;
                comEntity.AdharcardNo = upData.AdharcardNo != null ? upData.AdharcardNo : comEntity.AdharcardNo;
                comEntity.UpdatedAt = DateTime.UtcNow;
                //logic su chhe aanu belo haji uperni feild baki che kham hu karu chu e nu
                //uper find karavi ne e feild ma save change thase
                userFlat.FlatNo = upData.FlatNo;//ani jarur chhe ? have rakheli hati admin ne khabar pade
                userFlat.FatherName = upData.FatherName != null ? upData.FatherName : userFlat.FatherName;
                userFlat.MotherName = upData.MotherName != null ? upData.MotherName : userFlat.MotherName;
                userFlat.SpouseName = upData.SpouseName != null ? upData.SpouseName : userFlat.SpouseName;
                userFlat.Occupation = upData.Occupation != null ? upData.Occupation : userFlat.Occupation;
                userFlat.SpouseOccupation = upData.SpouseOccupation != null ? upData.SpouseOccupation : userFlat.SpouseOccupation;
                userFlat.AnotherPhoneNo = upData.AnotherPhoneNo != null ? upData.AnotherPhoneNo : userFlat.AnotherPhoneNo;
                userFlat.AnotherIdProof = anotherproof;
                //done 
                userFlat.NoOfChild = upData.NoOfChild != null ? upData.NoOfChild : userFlat.NoOfChild;
                userFlat.RelationshipStatus = upData.RelationshipStatus != null ? upData.RelationshipStatus : userFlat.RelationshipStatus;
               userFlat.DateOfBirth=upData.DateOfBirth!=null ? upData.DateOfBirth : userFlat.DateOfBirth;
                //done ? haally finally
                ///ohh yaar aapre userFlat and comEntity na object ma changes karya chheeeeee... yaar ... me karu chhu ok
                dbContext.UserMasters.Update(comEntity);
                dbContext.UserPersonalDetails.Update(userFlat);
                dbContext.SaveChanges();
                return Ok(new { message = "Member updated successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }

        }


        [HttpGet]
        [Route("{id:int}")]
        public IActionResult getAllMemberById(int id)
        {
            try
            {
                var member = (from u in dbContext.UserMasters
                        join up in dbContext.UserPersonalDetails on u.Id equals up.UserId

                        // Join with the latest CommitteMemberRecord for this user
                        //join c in (
                        //    from cmr in dbContext.CommitteMemberRecords
                        //    where cmr.UserId == id
                        //    orderby cmr.Id descending
                        //    select cmr
                        //).Take(1) on u.Id equals c.UserId

                        //join cm in dbContext.SocietyCommitteMasters on c.CommittieTypeId equals cm.Id
                        where u.Id == id
                        select new
                        {
                            u.Id,
                            u.FirstName,
                            u.MiddleName,
                            u.LastName,
                            u.Email,
                            photo = !string.IsNullOrEmpty(u.ProfilePhoto) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{u.ProfilePhoto}" : null,
                            
                            u.PhoneNo,
                            u.Gender,
                            u.Address,
                            u.TotalFamilyMember,
                            u.AdharcardNo,
                            u.SquarfootSize,
                            LivingDate = u.LivingDate.HasValue ? u.LivingDate.Value.ToString("dd-MM-yyyy") : null,
                            u.Status,
                            u.CreatedAt,
                            u.UpdatedAt,

                            up.FlatNo,
                            up.FatherName,
                            up.MotherName,
                            up.SpouseName,
                            up.SpouseOccupation,
                            up.AnotherPhoneNo,
                            up.NoOfChild,
                            anotherIdProof = !string.IsNullOrEmpty(up.AnotherIdProof) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{up.AnotherIdProof}" : null,
                   
                            up.RelationshipStatus,
                            up.Occupation,

                            //cm.CommitteName
                        }).FirstOrDefault();

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
