using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesRecordController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        private readonly IFileService fileService;
        public ExpensesRecordController(SociosphereContext dbContext, IFileService fileService) {
            this.dbContext = dbContext;
            this.fileService = fileService;
        }

        [HttpGet]
        public IActionResult getAllExpensesRecord()
        {
            try
            {

                var record =
                    (from er in dbContext.ExpensesRecords
                     join e in dbContext.ExpensesMasters on er.ExpensesTypeId equals e.Id
                     where e.Status == "Active"
                     select new
                     {
                         er.Id,
                         er.ExpensesTypeId,
                         er.ExpensesTitle,
                         er.Description,
                         er.Price,
                         er.Invoice,
                         ExpensesDate=er.ExpensesDate.Value.ToString("dd-MM-yyyy"),
                         normalExDate = er.ExpensesDate,
                         Photo = !string.IsNullOrEmpty(er.BillImage) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{er.BillImage}" : null,
                         extype = e.ExpensesName,
                         er.Status

                     }).ToList();
                    
                if (record == null || !record.Any())
                {
                    return NotFound(new { message = "No Expenses record found!" });

                }
                return Ok(record);

            }
            catch (Exception ex) {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });
            }
        }
        [HttpPost]
        public async Task<IActionResult> addExpensesRecord(AddExpensesRecorddata record)
        {
            try
            {
                String today = DateTime.UtcNow.ToString("yyyyMMdd-HHmmss");
                var expensesnumber = dbContext.ExpensesRecords.Count();
                expensesnumber = expensesnumber +1;
                string invoicenumber = $"EXP-{today}-0{expensesnumber}";
                //var exType = dbContext.ExpensesMasters.Any(e => e.Id == record.ExpensesTypeId);
                //if(!exType)
                //{   
                //    return BadRequest(new { message = "Invalid Expenses type" });
                //}
                string fileName = await fileService.uploadFile(record.BillImage, "uploadimage");

                var expensesrecord = new ExpensesRecord
                {
                    ExpensesTypeId = record.ExpensesTypeId,
                    ExpensesTitle = record.ExpensesTitle,
                    Description = record.Description,
                    Price = record.Price,
                    Invoice = invoicenumber,
                    ExpensesDate = record.ExpensesDate,
                    BillImage=fileName,
                    Status = record.Status,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.ExpensesRecords.Add(expensesrecord);
                dbContext.SaveChanges();
                return Ok(new {message="Expenses record added successfully !"});
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }

        [HttpPut]
        [Route("updateExpensesRecord/{id:int}")]
        public async Task<IActionResult> updateExpensesRecord(int id,UpdateExpensesRecordData recordData)
        {
            try
            {
                var record = dbContext.ExpensesRecords.Find(id);
                if (record == null)
                {
                    return NotFound(new { message = "Expenses record not found!" });
                }
                var exType = dbContext.ExpensesMasters.Any(e => e.Id == recordData.ExpensesTypeId);
                if (!exType)
                {
                    return BadRequest(new { message = "Invalid Expenses type" });

                }
                if (recordData.BillImage != null)
                {
                    if (!string.IsNullOrEmpty(record.BillImage))
                    {
                        var oldPath = Path.Combine("wwwroot/uploadimage", record.BillImage);
                        if (System.IO.File.Exists(oldPath))
                        {
                            System.IO.File.Delete(oldPath);
                        }

                    }
                    string fileName = await fileService.uploadFile(recordData.BillImage, "uploadimage");
                    record.BillImage = fileName;
                }
                record.ExpensesTypeId = recordData.ExpensesTypeId;
                record.ExpensesTitle = recordData.ExpensesTitle;
                record.Description = recordData.Description;
                record.Price = recordData.Price;
                record.ExpensesDate = recordData.ExpensesDate;
                record.Status=recordData.Status;
                record.UpdatedAt=DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = "Expenses record updated successfully!" });

            }
            catch (Exception ex) {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpGet]
        [Route("{id:int}")]
        public IActionResult getExpensesRecordById(int id)
        {
            try {
                var record = dbContext.ExpensesRecords.Include(a => a.ExpensesType).Where(a => a.Id == id).
                  Select(a => new
                  {
                      a.Id,
                      a.ExpensesTypeId,
                      a.ExpensesTitle,
                        a.Description,
                      a.Price,
                      a.Invoice,
                      ExpensesDate = a.ExpensesDate.Value.ToString("dd-MM-yyyy"),
                      normalExDate=a.ExpensesDate,
                      Photo = !string.IsNullOrEmpty(a.BillImage) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{a.BillImage}" : null,
                      a.Status,
                      extype=a.ExpensesType.ExpensesName,
                  }).FirstOrDefault();
                if (record == null)
                {
                    return NotFound(new { message = "Expenses record not found!" });
                }
                return Ok(record);
            }
            catch (Exception ex) {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpDelete]
        [Route("{id:int}")]
        public IActionResult deleteExpensesRecord(int id) {
            try
            {
                var record = dbContext.ExpensesRecords.Find(id);
                if (record == null)
                {
                    return NotFound(new { message = "Expenses record not found!" });
                }
              
                    if (!string.IsNullOrEmpty(record.BillImage))
                    {
                        var oldPath = Path.Combine("wwwroot/uploadimage", record.BillImage);
                        if (System.IO.File.Exists(oldPath))
                        {
                            System.IO.File.Delete(oldPath);
                        }

                    }
                
                dbContext.Remove(record);
                dbContext.SaveChanges();
                return Ok(new {messae="Expenses record deleted succesfully"});
            }
            catch (Exception ex) {
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });
            }
        }
        [HttpPut]
        [Route("togglestatus/{id:int}")]
        public IActionResult toggleExpensesRecordStatus(int id)
        {
            try
            {
                var record = dbContext.ExpensesRecords.Find(id);
                if (record == null)
                {
                    return NotFound(new { message = "Expenses record not found!" });
                }
                if (record.Status == "Pending")
                {
                    record.Status = "Complete";
                }
                else
                {
                    record.Status = "Pending";
                }
                record.UpdatedAt = DateTime.Now;
                dbContext.SaveChanges();
                return Ok(new { message = $"Expenses record status {record.Status} successfully" });

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }

        }
        [HttpGet]
        [Route("getActiveExpensesType")]
        public IActionResult getAgencyType()
        {
            try
            {
                var type = dbContext.ExpensesMasters.
                    Where(e => e.Status == "Active").
                    Select(e => new
                    {
                        e.Id,
                        e.ExpensesName
                    }).ToList();
                return Ok(type);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpGet]
        [Route("expensesRecordByType/{id:int}")]
        public IActionResult getExpensesByExpensestypeId(int id)
        {
            try
            {
                var agency = dbContext.ExpensesRecords.Include(a => a.ExpensesType).Where(a => a.ExpensesTypeId == id).
                    Select(a => new
                    {
                        a.Id,
                        a.ExpensesTypeId,
                        a.ExpensesTitle,
                        a.Description,
                        a.Price,
                        a.Invoice,
                        ExpensesDate = a.ExpensesDate.Value.ToString("dd-MM-yyyy"),
                        Photo = !string.IsNullOrEmpty(a.BillImage) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{a.BillImage}" : null,
                        extype = a.ExpensesType.ExpensesName,
                        a.Status
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

    }
}
