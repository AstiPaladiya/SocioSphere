using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocioSphere.Models.Entity;
using SocioSphere.Models.UserDataModels.AddUserData;
using SocioSphere.Models.UserDataModels.UpdateUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpensesRecordController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        public ExpensesRecordController(SociosphereContext dbContext) {
            this.dbContext = dbContext;
        }

        [HttpGet]
        public IActionResult getAllExpensesRecord()
        {
            try
            {
                var record = dbContext.ExpensesRecords.Include(e=>e.ExpensesType).
                    Select(e=> new {
                           e.Id,
                           e.ExpensesTypeId,
                           e.ExpensesTitle,
                           e.Description,
                           e.Price,
                           e.Invoice,
                           e.ExpensesDate,
                           extype=e.ExpensesType.ExpensesName,
                           e.Status
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
        public IActionResult addExpensesRecord(AddExpensesRecorddata record)
        {
            try
            {
                String today = DateTime.UtcNow.ToString("yyyyMMdd-HHmmss");
                var expensesnumber = dbContext.ExpensesRecords.Count();
                expensesnumber = expensesnumber +1;
                string invoicenumber = $"EXP-{today}-0{expensesnumber}";
                var exType = dbContext.ExpensesMasters.Any(e => e.Id == record.ExpensesTypeId);
                if(!exType)
                {
                    return BadRequest(new { message = "Invalid Expenses type" });

                }
                var expensesrecord = new ExpensesRecord
                {
                    ExpensesTypeId = record.ExpensesTypeId,
                    ExpensesTitle = record.ExpensesTitle,
                    Description = record.Description,
                    Price = record.Price,
                    Invoice = invoicenumber,
                    ExpensesDate = record.ExpensesDate,
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
        public IActionResult updateExpensesRecord(int id,UpdateExpensesRecordData recordData)
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
                record.ExpensesTypeId = recordData.ExpensesTypeId;
                record.ExpensesTitle = recordData.ExpensesTitle;
                record.Description = recordData.Description;
                record.Price = recordData.Price;
                record.ExpensesDate = recordData.ExpensesDate;
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
                      a.ExpensesDate,
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
        public IActionResult deleteExpensesRecord(int id) {
            try
            {
                var record = dbContext.ExpensesRecords.Find(id);
                if (record == null)
                {
                    return NotFound(new { message = "Expenses record not found!" });
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
                    record.Status = "Completed";
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
    }
}


















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































