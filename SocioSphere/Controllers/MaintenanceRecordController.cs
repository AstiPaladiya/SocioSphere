using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MaintenanceRecordController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        private readonly IFileService _fileService;

        public MaintenanceRecordController(SociosphereContext dbContext, IFileService fileService)
        {
            this.dbContext = dbContext;
            this._fileService = fileService;
        }

        //Member side 
        [HttpGet]
        [Route("getAllMaintenanceDetailByMember")]
        public IActionResult getAllMaintenanceByMember()
        {
            try
            {
                var userId = Request.Headers["UserId"].ToString();
                int uid = int.Parse(userId);
                var maintenanceDetial = (from m in dbContext.MaintenanceChargeMasters orderby m.CreatedAt descending
                                         join mr in dbContext.MaintenanceRecords.Where(x=>x.UserId==uid) on m.Id equals mr.MaintenanceId  into mrgroup
                                         from mr in mrgroup.DefaultIfEmpty()    //left join
                                         select new
                                         {
                                             m.Id,
                                             m.MaintenanceCharge,
                                             m.MaintenanceType,
                                             StartingMonthYear = m.StartingMonthYear.Value.ToString("MMMM yyyy"),
                                             DueMonthYear = m.DueMonthYear.Value.ToString("MMMM yyyy"),
                                             EndMonthYear = m.EndMonthYear.Value.ToString("MMMM yyyy"),
                                             m.LatePaymentCharge,
                                             m.Description,
                                             IsEditable = !dbContext.MaintenanceRecords.Any(r => r.MaintenanceId == m.Id),
                                             MaintenanceRecordId = mr != null ? mr.Id : 0,
                                             PaymentDate = mr != null ? mr.PaidDate.Value.ToString("dd-MM-yyyy") : null,
                                             Member = mr != null ? mr.User.FirstName + " " + mr.User.LastName : null,
                                             TotalMaintenance = mr != null ? mr.TotalMaintenance : null,
                                             Photo = !string.IsNullOrEmpty(mr.PaymentImage) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{mr.PaymentImage}" : null,
                                             LatePaymentAmount = mr != null ? mr.LatePaymentAmount : null,
                                             LatePaymentReason = mr != null ? mr.LatePaymentReason : null,
                                             Status = mr != null ? mr.Status : null,
                                             RecieptNo=mr!=null?mr.ReceiptNo:null
                                         }).ToList();
                if (maintenanceDetial == null && !maintenanceDetial.Any())
                {
                    return NotFound(new { message = "Maintenace record not available" });
                }
                return Ok(maintenanceDetial);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpGet]
        [Route("getParticularMaintananceDetailByMember/{id:int}")]
        public IActionResult getParticularMaintenanceDetailByMember(int id)
        {
            try
            {
                var uid = Request.Headers["UserId"].ToString();
                int UserId = int.Parse(uid);
                var userdetail=dbContext.UserPersonalDetails.Where(userdetail=>userdetail.UserId==UserId).FirstOrDefault();
                var currentDate = DateOnly.FromDateTime(DateTime.UtcNow);
                var maintenancedetail = (from m in dbContext.MaintenanceChargeMasters
                                         where m.Id == id
                                         from u in dbContext.UserMasters
                                         where u.Id == UserId
                                         let montlycharge = m.MaintenanceType == "Squrefootsize" ?
                                             m.MaintenanceCharge * u.SquarfootSize : m.MaintenanceCharge
                                         let yearlycharge = m.MaintenanceType == "Squrefootsize" ?
                                            m.MaintenanceCharge * u.SquarfootSize * 12 : m.MaintenanceCharge * 12
                                         let isLatePayment = m.DueMonthYear < currentDate
                                         let pendingMonth = isLatePayment ? EF.Functions.DateDiffMonth(m.DueMonthYear, currentDate) : 0
                                         let extraCharge = m.LatePaymentCharge * pendingMonth
                                         let finalMaintenanceCharge = yearlycharge + extraCharge
                                         select new
                                         {
                                             m.Id,
                                             m.MaintenanceCharge,
                                             m.MaintenanceType,
                                             StartingMonthYear = m.StartingMonthYear.Value.ToString("MMMM yyyy"),
                                             DueMonthYear = m.DueMonthYear.Value.ToString("MMMM yyyy"),
                                             EndMonthYear = m.EndMonthYear.Value.ToString("MMMM yyyy"),
                                             m.LatePaymentCharge,
                                             m.Description,
                                             u.SquarfootSize,
                                             montlycharge,
                                             yearlycharge,
                                             pendingMonth,
                                             extraCharge,
                                             isLatePayment,
                                             finalMaintenanceCharge,
                                             username=u.FirstName+" "+u.LastName,
                                             userdetail.FlatNo,
                                             paidDate = currentDate.ToString("dd-MM-yyyy")
                                         }).ToList();
                if (maintenancedetail == null && !maintenancedetail.Any())
                {
                    return NotFound(new { message = "Maintenace record not available" });
                }
                return Ok(maintenancedetail);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }


        [HttpPost]
        public async  Task<IActionResult> addPayment(AddMaintenancePaymentData addData)
        {
            try
            {
                //var userId = Request.Headers["userid"].ToString();
                //int uid = int.Parse(userId);
                string fileName = await _fileService.uploadFile(addData.PaymentImage, "uploadimage");
                var record = new MaintenanceRecord
                {
                    MaintenanceId=addData.MaintenanceId,
                    UserId=addData.UserId,
                    TotalMaintenance=addData.TotalMaintenance,
                    PaidDate=addData.PaidDate,
                    PaymentImage=fileName,
                    LatePaymentAmount=addData.LatePaymentAmount,
                    LatePaymentReason =addData.LatePaymentReason,
                    Status="Awaiting Approval",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.MaintenanceRecords.Add(record);
                dbContext.SaveChanges();
                return Ok(new { message = "Payment Submitted Successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
    }
  
}
