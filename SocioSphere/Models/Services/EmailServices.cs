using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using MimeKit;

namespace SocioSphere.Models.Services
{
    public interface IEmailService
    {
        Task sendMailAsync(string toEmail, string suject, string message);
    }

    public class EmailServices : IEmailService
    {   
        private readonly IConfiguration _config;
        public EmailServices(IConfiguration config) 
            {
                _config = config;
            }

        public async Task sendMailAsync(string toEmail, string suject, string message)
        {
            var smtpSettings = _config.GetSection("SmtpSettings");
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(smtpSettings["SenderName"],
            smtpSettings["SenderEmail"]
            ));
            emailMessage.To.Add(MailboxAddress.Parse(toEmail));
            emailMessage.Subject = suject;
            var builder = new BodyBuilder
            {
                HtmlBody = message
            };
            emailMessage.Body = builder.ToMessageBody();
            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpSettings["Server"], int.Parse(smtpSettings["Port"]), SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(smtpSettings["Username"], smtpSettings["Password"]);
            await smtp.SendAsync(emailMessage);
            await smtp.DisconnectAsync(true);

        }
    
    }
}
