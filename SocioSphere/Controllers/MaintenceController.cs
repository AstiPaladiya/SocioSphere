using MailKit.Search;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenceController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable
        private readonly IEmailService _emailService;

        //contruct of this controller
        public MaintenceController(SociosphereContext dbContext, IEmailService emailService)
        {
            this.dbContext = dbContext;
            _emailService = emailService;
        }

        [HttpGet]
        [Route("DefaultCurrentMaintenaceDetailWithMemberRecord")]
        public IActionResult getAllMaintenance()
        {
            try
            {
                // Step 1: Get latest maintenance
                var latestMaintenance = dbContext.MaintenanceChargeMasters
                    .OrderByDescending(m => m.CreatedAt)
                    .FirstOrDefault();

                List<object> maintenance = new List<object>(); // define outside

                if (latestMaintenance != null)
                {
                    maintenance = (from m in dbContext.MaintenanceChargeMasters
                                   where m.Id == latestMaintenance.Id
                                   join mr in dbContext.MaintenanceRecords on m.Id equals mr.MaintenanceId into mrgroup
                                   from mr in mrgroup.DefaultIfEmpty()
                                   join up in dbContext.UserPersonalDetails on mr.UserId equals up.UserId into upgroup
                                   from up in upgroup.DefaultIfEmpty()
                                   select new
                                   {
                                       m.Id,
                                       m.MaintenanceCharge,
                                       m.MaintenanceType,
                                       StartingMonthYear = m.StartingMonthYear.HasValue ? m.StartingMonthYear.Value.ToString("MMMM yyyy") : null,
                                       DueMonthYear = m.DueMonthYear.HasValue ? m.DueMonthYear.Value.ToString("MMMM yyyy") : null,
                                       EndMonthYear = m.EndMonthYear.HasValue ? m.EndMonthYear.Value.ToString("MMMM yyyy") : null,
                                       m.LatePaymentCharge,
                                       m.Description,
                                       IsEditable = !dbContext.MaintenanceRecords.Any(r => r.MaintenanceId == m.Id),
                                       MaintenanceRecordId = mr != null ? mr.Id : 0,
                                       PaymentDate = mr != null ? mr.PaidDate.Value.ToString("dd-MM-yyyy") : null,
                                       FlatNo = up != null ? up.FlatNo : null,
                                       Member = mr != null ? mr.User.FirstName + " " + mr.User.LastName : null,
                                       TotalMaintenance = mr != null ? mr.TotalMaintenance : null,
                                       Photo = !string.IsNullOrEmpty(mr.PaymentImage) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{mr.PaymentImage}" : null,
                                       LatePaymentAmount = mr != null ? mr.LatePaymentAmount : null,
                                       LatePaymentReason = mr != null ? mr.LatePaymentReason : null,
                                       Status = mr != null ? mr.Status : null,
                                       mr.ReceiptNo
                                   }).ToList<object>();
                }

                if (maintenance == null || !maintenance.Any())
                {
                    return NotFound(new { message = "Maintenance detail not available" });
                }

                return Ok(maintenance);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }

        [HttpGet]
        [Route("maintenanceDateDropDown")]
        public IActionResult getmaintenanceDropDown()
        {
            try
            {
                var maintenanceDrp=(from m in dbContext.MaintenanceChargeMasters
                                    select new
                                    {
                                        m.Id,
                                        startmonth=m.StartingMonthYear.Value.ToString("MMMM yyyy"),
                                        endmonth=m.EndMonthYear.Value.ToString("MMMM yyyy")
                                    }).ToList();
                return Ok(maintenanceDrp);
            }catch(Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpGet]
        [Route("getMaintenanceById/{id:int}")]
        public IActionResult getAllMaintenance(int id)
        {
            try
            {
                // Step 1: Get latest maintenance
                var latestMaintenance = dbContext.MaintenanceChargeMasters
                    .Find(id);

                List<object> maintenance = new List<object>(); // define outside

                if (latestMaintenance != null)
                {
                    maintenance = (from m in dbContext.MaintenanceChargeMasters
                                   where m.Id == latestMaintenance.Id
                                   join mr in dbContext.MaintenanceRecords on m.Id equals mr.MaintenanceId into mrgroup
                                   from mr in mrgroup.DefaultIfEmpty()
                                   join up in dbContext.UserPersonalDetails on mr.UserId equals up.UserId into upgroup
                                   from up in upgroup.DefaultIfEmpty()
                                   select new
                                   {
                                       m.Id,
                                       userid=up.UserId,
                                       m.MaintenanceCharge,
                                       m.MaintenanceType,
                                       StartingMonthYear = m.StartingMonthYear.HasValue ? m.StartingMonthYear.Value.ToString("MMMM yyyy") : null,
                                       DueMonthYear = m.DueMonthYear.HasValue ? m.DueMonthYear.Value.ToString("MMMM yyyy") : null,
                                       EndMonthYear = m.EndMonthYear.HasValue ? m.EndMonthYear.Value.ToString("MMMM yyyy") : null,
                                       m.LatePaymentCharge,
                                       m.Description,
                                       IsEditable = !dbContext.MaintenanceRecords.Any(r => r.MaintenanceId == m.Id),
                                       MaintenanceRecordId = mr != null ? mr.Id : 0,
                                       PaymentDate = mr != null ? mr.PaidDate.Value.ToString("dd-MM-yyyy") : null,
                                       FlatNo = up != null ? up.FlatNo : null,
                                       Member = mr != null ? mr.User.FirstName + " " + mr.User.LastName : null,
                                       TotalMaintenance = mr != null ? mr.TotalMaintenance : null,
                                       Photo = !string.IsNullOrEmpty(mr.PaymentImage) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{mr.PaymentImage}" : null,
                                       LatePaymentAmount = mr != null ? mr.LatePaymentAmount : null,
                                       LatePaymentReason = mr != null ? mr.LatePaymentReason : null,
                                       Status = mr != null ? mr.Status : null
                                   }).ToList<object>();
                }

                if (maintenance == null || !maintenance.Any())
                {

                    return NotFound(new { message = "Maintenace detail not available" });
                }
                return Ok(maintenance);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpPut]
        [Route("approvemaintenace/{id:int}")]
        public  async Task<IActionResult> approveMaintenance(int id)
        {
            try {

                var data = dbContext.MaintenanceRecords.Find(id);
                var user = dbContext.UserMasters.FirstOrDefault(u => u.Id == data.UserId);
                var paidDate = data.CreatedAt.Value.ToString("yyyyMMdd-HHmmss");
                var maintenancerecord = dbContext.MaintenanceRecords.Count();
                maintenancerecord = maintenancerecord + 1;
                string receiptno = $"RCPT-{paidDate}-0{maintenancerecord}";
                data.ReceiptNo = receiptno;
                data.Status = "Completed";

                String toEmail = user.Email;
                String subject = "Maintenance Payment Approved - SocioSphere" ;
                String message = "<h2>Dear, " + user.FirstName + " " + user.LastName + "</h2>" +
                    " <p>We inform you to Your maintenance payment has been <strong>approved</strong>.</p>" +
                    "<p><strong>Receipt Number:</strong>" + receiptno + "</p>" +
                    "<p>Kindly check your receipt</p>";
                  
                await _emailService.sendMailAsync(toEmail, subject, message);
                dbContext.SaveChanges();
                return Ok(new { message = "Maintenance status approved successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpPut]
        [Route("rejectmaintenace/{id:int}")]
        public async Task<IActionResult> rejectMaintenance(int id,AddrejectMaintenance rejData)
        {
            try
            {

                var data = dbContext.MaintenanceRecords.Find(id);
                var user = dbContext.UserMasters.FirstOrDefault(u => u.Id == data.UserId);

                data.Status = "Rejected";
                string reason = rejData.reason;
                String toEmail = user.Email;
                String subject = "Maintenance Payment Rejected - SocioSphere";
                String message = "<h2>Dear, " + user.FirstName + " " + user.LastName + "</h2>" +
                     "<p>We regret to inform you that your maintenance payment has been <strong>rejected</strong></span>.</p>" +
                    "<p><strong>Reason for Rejection:</strong> " + reason + "</p>" +
                    "<p>To complete your maintenance dues, you are kindly requested to <strong>submit the payment again</strong> through the SocioSphere portal.</p>";
                    
                await _emailService.sendMailAsync(toEmail, subject, message);
                dbContext.SaveChanges();
                return Ok(new { message = "Maintenance status rejected successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpPost("addMaintenance")]
        public IActionResult addMaintenace(AddMaintenanceData addData)
        {
            try
            {
          
                var maintenaceEntity = new MaintenanceChargeMaster
                {
                    MaintenanceCharge = addData.MaintenanceCharge,
                    Description = addData.Description,
                    StartingMonthYear = new DateOnly(addData.StartingMonthYear.Value.Year, addData.StartingMonthYear.Value.Month, 1),
                    DueMonthYear = new DateOnly(addData.DueMonthYear.Value.Year, addData.DueMonthYear.Value.Month, 1),
                    EndMonthYear = new DateOnly(addData.EndMonthYear.Value.Year, addData.EndMonthYear.Value.Month, 1),
                    LatePaymentCharge = addData.LatePaymentCharge,
                    MaintenanceType = addData.MaintenanceType,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.MaintenanceChargeMasters.Add(maintenaceEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Maintenance detail added successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpPut]
        [Route("updateMaintenace/{id:int}")]
        public IActionResult updateMaintenace(int id,UpdateMaintenanceData upData)
        {
            try
            {
                var manId = dbContext.MaintenanceChargeMasters.Find(id);
              var chkManRecordId = dbContext.MaintenanceRecords.FirstOrDefault(m => m.MaintenanceId == id);
           

                    if (chkManRecordId == null)
                    {
                        manId.MaintenanceCharge = upData.MaintenanceCharge;
                        manId.Description = upData.Description;
                        manId.StartingMonthYear = new DateOnly(upData.StartingMonthYear.Value.Year, upData.StartingMonthYear.Value.Month, 1);
                        manId.DueMonthYear = new DateOnly(upData.DueMonthYear.Value.Year, upData.DueMonthYear.Value.Month, 1);
                        manId.EndMonthYear = new DateOnly(upData.EndMonthYear.Value.Year, upData.EndMonthYear.Value.Month, 1);
                        manId.LatePaymentCharge=upData.LatePaymentCharge;
                        manId.MaintenanceType=upData.MaintenanceType;
                        manId.UpdatedAt = DateTime.UtcNow;
                        dbContext.SaveChanges();
                        return Ok(new { message = "Maintenance detail updated successfully" });
                    }
                    else
                    {
                        return BadRequest(new { message = "Cannot update this maintenance record because some members have already paid it." });
                    }
                

            }
            catch (Exception ex) {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });


            }
        }
    }
}
