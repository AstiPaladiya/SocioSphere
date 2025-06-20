    using BCrypt.Net;
    using Microsoft.AspNetCore.Http;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.IdentityModel.Tokens;
    using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;
    using System.Data;
    using System.IdentityModel.Tokens.Jwt;
    using System.Security.Claims;
    using System.Text;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        private readonly IConfiguration _config;

        private readonly IEmailService emailService;

        public LoginController(SociosphereContext dbContext, IConfiguration config, IEmailService emailService)
        {
            this.dbContext = dbContext;
            _config = config;
            this.emailService = emailService;
        }

        [HttpPost]
        [Route("login")]
        public IActionResult Login(LoginCredential loginCredential)
        {
            var user = dbContext.UserMasters.Include(u => u.Group).FirstOrDefault(u => u.Email == loginCredential.Email);
            if (user == null) {
                return Unauthorized(new { message = "Invalid Email.Please try again!" });
            }
            bool passwordValid = BCrypt.Net.BCrypt.Verify(loginCredential.Password, user.Password);
            if (passwordValid == false) {
                return Unauthorized(new { message = "Invalid Password.Please try again!" });
            }
            if (user.Status != "Active")
            {
                return Unauthorized(new { message = "Account has been blocked.Contact Admin!" });
            }
            string userRole = user.Group?.GroupName ?? "Unknown";
            string token = GenerateJwtToken(user, userRole);

            // Redirect URL based on role
            string redirectUrl = userRole switch
            {
                "Admin" => "/Admin/",
                "Member" => "/Member/",
                "Watchmen" => "/Watchmen/",
                _ => "/Login"
            };
            return Ok(new { message = "Login Successfuly", token = token, role = userRole, redirectUrl = redirectUrl });
        }
        // Function to get role name based on GroupId
        //private string GetUserRole(int groupId)
        //{
        //    return groupId switch
        //    {
        //        1 => "Admin",
        //        2 => "Member",
        //        3 => "Watchmen",
        //        _ => "Unknown"
        //    };
        //}

        private string GenerateJwtToken(UserMaster user, string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var claims = new[] {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                    new Claim("UserId", user.Id.ToString()),
                    new Claim(ClaimTypes.Role, role),

                };
            var token = new JwtSecurityToken(
                    _config["Jwt:Issuer"],
                    _config["Jwt:Audience"],
                    claims,
                    expires: DateTime.UtcNow.AddHours(2),
                    signingCredentials: credential
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        
    
        [HttpGet]
        [Route("send-otp/{email}")]
        public async Task<IActionResult> SendOtp(string email)
        {
            var user = await dbContext.UserMasters.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return Ok(new
                {
                    Status = false,
                    Message = "User not found"
                });
            }
            var otp = new Random().Next(100000, 999999).ToString();
            var Otp = otp;
            var htmlBody = "Your OTP is :<b>" + Otp + "</b>. Please use this code to reset your password.";
            // Send OTP via email
            await emailService.sendMailAsync(email, "Your OTP Code", htmlBody);
            return Ok(new
            {
                Status = true,
                Message = "OTP sent successfully",
                Data = Otp
            });
        }

        [HttpPost]
        [Route("reset-password")]
        public async Task<IActionResult> ResetPassword(UserForgetPasswordDto user)
        {
            var existingUser = await dbContext.UserMasters.FirstOrDefaultAsync(u => u.Email == user.Email);
            if (existingUser != null)
            {
                // Check if password is correct
                if (BCrypt.Net.BCrypt.Verify(user.Password, existingUser.Password))
                {
                    return Ok(new
                    {
                        Status = false,
                        Message = "You cannot reset your password to the same password"
                    });
                }
                else
                {
                    existingUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                    dbContext.UserMasters.Update(existingUser);
                    await dbContext.SaveChangesAsync();
                    return Ok(new
                    {
                        Status = true,
                        Message = "Password reset successfully",
                    });
                }
            }
            else
            {
                return Ok(new
                {
                    Status = false,
                    Message = "User Not Found"
                });
            }
        }
    }
}
