using Microsoft.AspNetCore.Authorization;
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
    public class EventController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable
        private readonly IFileService fileService;
        //contruct of this controller
        public EventController(SociosphereContext dbContext, IFileService fileService)
        {
            this.dbContext = dbContext;
            this.fileService = fileService;
        }

        [HttpGet]
        [Route("diplayAllPaidEvent")]
        public IActionResult getAllPaidEvent()
        {
            try
            {
               var ev=dbContext.EventMasters.Where(e=>e.EventType=="Paid").ToList();
                if (ev == null || !ev.Any()) { 
                    return NotFound(new {message="Event record not found"});
                }
                return Ok(ev);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpGet]
        [Route("diplayAllFreeEvent")]
        public IActionResult getAllFreeEvent()
        {
            try
            {
                var ev = dbContext.EventMasters.Where(e => e.EventType == "Free").ToList();
                if (ev == null || !ev.Any())
                {
                    return NotFound(new { message = "Event record not found" });
                }
                return Ok(ev);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpGet]
        [Route("getEventById/{id:int}")]
        public IActionResult getEventById(int id) {
            try
            {
                var ev = dbContext.EventMasters.Find(id);
                if (ev == null)
                {
                    return NotFound(new { message = "Event record not found" });
                }
                return Ok(ev);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpPost]
        public IActionResult addEvent(AddEventData addEv)
        {
            try {
                var evEntity = new EventMaster
                {
                    EventType = addEv.EventType,
                    EventName = addEv.EventName,
                    Description = addEv.Description,
                    EventDate=addEv.EventDate,
                    EventTime=addEv.EventTime,
                    Destination=addEv.Destination,
                    PriceType=addEv.PriceType,
                    Price=addEv.Price,
                    Status="Upcoming",
                    CreatedAt=DateTime.UtcNow,
                    UpdatedAt=null
                };
                dbContext.EventMasters.Add(evEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Event added successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpPut]
        [Route("updateEvent/{id:int}")]
        public IActionResult updateEvent(int id,UpdateEventData upData)
        {
            try
            {
                var evId=dbContext.EventMasters.Find(id);
                if(evId == null)
                {
                    return NotFound();
                }
                evId.EventType = upData.EventType;
                evId.EventName = upData.EventName;
                evId.Description = upData.Description;
                evId.EventDate = upData.EventDate;
                evId.EventTime = upData.EventTime;
                evId.Destination = upData.Destination;
                evId.PriceType = upData.PriceType;
                evId.Price = upData.Price;
                evId.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = "Event updated successfully" });
            }
            catch (Exception ex) {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpPut]
        [Route("updateStatusCompleted/{id:int}")]
        public IActionResult updateEventCompleted(int id)
        {
            try
            {
                var ev=dbContext.EventMasters.Find(id);
                if (ev == null)
                {
                    return NotFound();
                }
                ev.Status = "Completed";
                ev.UpdatedAt= DateTime.UtcNow;  
                dbContext.SaveChanges();
                return Ok(new { message = $"Event status {ev.Status} successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpGet]
        [Route("updateStatusCancled/{id:int}")]
        public IActionResult updateEventCancled(int id, [FromQuery]string reason) {
            try
            {
                var ev = dbContext.EventMasters.Find(id);
                if (ev == null)
                {
                    return NotFound();
                }
                ev.Reason = reason;
                ev.Status = "Cancled";
                ev.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = $"Event status {ev.Status} successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpGet]
        [Route("allPaidEventRecordForAdmin/{id:int}")]
        public IActionResult getAllPaidEventRecord(int id)
        {
            try
            {
                var ev = (from e in dbContext.EventMasters
                          join pv in dbContext.PaidEventRecords on e.Id equals pv.EventId
                          join u in dbContext.UserMasters on pv.UserId equals u.Id
                          where e.Id == id
                          select new {
                            pv.Id,
                            pv.EventId,
                            pv.UserId,
                            pv.TotalMember,
                            pv.TotalPrice,
                            pv.CreatedAt,
                            username=u.FirstName+" "+u.LastName,
                           photo = !string.IsNullOrEmpty(pv.PaymentImage)
                            ? $"{Request.Scheme}://{Request.Host}/uploadimage/{pv.PaymentImage}"
                            : null,
                            pv.Status
                          }).ToList();
                return Ok(ev);
            }catch(Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpGet]
        [Route("updateMEventRecordStatusCompleted/{int:id}")]
        public IActionResult updateEventRecordStatus(int id)
        {
            try
            {
                var ev=dbContext.PaidEventRecords.Find(id);
                if (ev == null) {
                    return NotFound();   
                }
                ev.Status = "Completed";
                    ev.UpdatedAt= DateTime.Now;
                dbContext.SaveChanges();
                return Ok(new { message = $"Paymenrt status {ev.Status} successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        //For member side
        //[Authorize]
        [HttpPost]
        [Route("registrationForEvent")]
        public async Task<IActionResult> addEventPayment(AddEventPaymentData addEventPayment)
        {
            try
            {
                string fileName = await fileService.uploadFile(addEventPayment.PaymentImage, "uploadimage");
                var evPayment = new PaidEventRecord
                {
                    EventId = addEventPayment.EventId,
                    UserId = addEventPayment.UserId,
                    TotalMember = addEventPayment.TotalMember,
                    TotalPrice = addEventPayment.TotalPrice,
                    PaymentImage = fileName,
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null,
                };
                dbContext.PaidEventRecords.Add(evPayment);
                dbContext.SaveChanges();
                return Ok(new { message = "Event registration successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        //[HttpGet]
        //[Route("allPaidEventByMember")]
        //public IActionResult getPaidEventByForMember()
        //{
        //    try
        //    {
        //        string mebId= Request.Headers["memberId"].ToString();
        //        int memberId = int.Parse(mebId);
        //        if (memberId != null)
        //        {
        //            var eventData = (from e in dbContext.EventMasters
        //                             join pv in dbContext.PaidEventRecords
        //                                 on new { EventId = e.Id, UserId = memberId }
        //                                 equals new { EventId = pv.EventId, pv.UserId } into eventPayments
        //                             from memberPayment in eventPayments.DefaultIfEmpty() 
        //                             select new 
        //                             {
        //                                 e.Id,
        //                                 e.EventName,
        //                                 e.EventDate,
        //                                 e.Destination,
        //                                 e.EventTime,
        //                                 e.Description,
        //                                 e.PriceType,
        //                                 e.Price,
        //                                 IsRegisteredByMember = memberPayment != null,
        //                                 MemberPaymentDetails = memberPayment != null
        //                                     ? new
        //                                     {
        //                                         memberPayment.TotalPrice,
        //                                         memberPayment.Status,
        //                                         PaidEventId = memberPayment.Id
        //                                     }
        //                                     : null
        //                             }).ToList();
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error: {ex.Message}");
        //        return StatusCode(500, new { message = "Something went wrong.Please try again!" });

        //    }
        //}
        //[HttpGet]
        //[Route("paymentReceipt/{id:int}")]
        //public IActionResult paymentReceipt(int id)
        //{
        //    try
        //    {
        //            var ev=dbContext.EventMasters.
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error: {ex.Message}");
        //        return StatusCode(500, new { message = "Something went wrong.Please try again!" });

        //    }
        //}
            
    }
}
