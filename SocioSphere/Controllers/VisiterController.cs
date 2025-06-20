using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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
    public class VisiterController : ControllerBase
    {
        private readonly SociosphereContext dbContext;
        private readonly IFileService _fileService;
        public VisiterController(SociosphereContext dbContext, IFileService fileService)
        {
            this.dbContext = dbContext;
            _fileService = fileService;
        }

        [HttpGet]
        public IActionResult getAllVisiterForAdmin()
        {
            try
            {

                var visiter = (from v in dbContext.Visiters
                               join u in dbContext.UserMasters on v.VisitingUserId equals u.Id
                               join w in dbContext.UserMasters on v.WatchmenId equals w.Id
                               join up in dbContext.UserPersonalDetails on u.Id equals up.UserId
                               select new
                               {
                                   v.Id,
                                   v.Name,
                                   v.PhoneNo,
                                   photo = !string.IsNullOrEmpty(v.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{v.Photo}" : null,
                                   EntryDate=v.EntryDate.Value.ToString("dd-MM-yyyy"),
                                   v.EntryTime,
                                   ExitDate=v.ExitDate.Value.ToString("dd-MM-yyyy"),
                                   v.ExitTime,
                                   v.VisitingUserId,
                                   v.WatchmenId,
                                   membername = u.FirstName + " " + u.LastName,
                                   watchmen = w.FirstName + " " + w.LastName,
                                   flatno = up.FlatNo
                               }).ToList();
                if (visiter == null || !visiter.Any()) {

                    return NotFound(new { message = "Visiter record not found" });
                }
                return Ok(visiter);
            } catch (Exception ex) {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }
        }

        [HttpGet]
        [Route("allVisiterForToday")]
        public IActionResult getTodayAllVisiterForAdmin()
        {
            try
            {
                var today = DateOnly.FromDateTime(DateTime.Today);

                var visiter = (from v in dbContext.Visiters where v.EntryDate==today
                               join u in dbContext.UserMasters on v.VisitingUserId equals u.Id
                               join w in dbContext.UserMasters on v.WatchmenId equals w.Id
                               join up in dbContext.UserPersonalDetails on u.Id equals up.UserId
                               
                               select new
                               {
                                   v.Id,
                                   v.Name,
                                   v.PhoneNo,
                                   photo = !string.IsNullOrEmpty(v.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{v.Photo}" : null,
                                   EntryDate = v.EntryDate.Value.ToString("dd-MM-yyyy"),
                                   v.EntryTime,
                                   ExitDate = v.ExitDate.Value.ToString("dd-MM-yyyy"),
                                   v.ExitTime,
                                   v.VisitingUserId,
                                   v.WatchmenId,
                                   membername = u.FirstName + " " + u.LastName,
                                   watchmen = w.FirstName + " " + w.LastName,
                                   flatno = up.FlatNo
                               }).ToList();
                if (visiter == null || !visiter.Any())
                {

                    return NotFound(new { message = "Visiter record not found" });
                }
                return Ok(visiter);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }
        }
        [HttpGet]
        [Route("getAllVisiterByWatchmen")]
        public IActionResult getAllVisiterByWatchmen()
        {
            try
            {
                var watchmenId = Request.Headers["watchmenId"].ToString();
                int watchId = int.Parse(watchmenId);
                if (watchId != null)
                {
                    var visiterData = (from v in dbContext.Visiters
                                       join u in dbContext.UserMasters on v.VisitingUserId equals u.Id
                                       join w in dbContext.UserMasters on v.WatchmenId equals w.Id
                                       join up in dbContext.UserPersonalDetails on u.Id equals up.UserId
                                       where v.WatchmenId == watchId
                                       select new {
                                           v.Id,
                                           v.Name,
                                           v.PhoneNo,
                                           photo = !string.IsNullOrEmpty(v.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{v.Photo}" : null,
                                           v.EntryDate,
                                           v.EntryTime,
                                           v.ExitDate,
                                           v.ExitTime,
                                           v.VisitingUserId,
                                           v.WatchmenId,
                                           membername = u.FirstName + " " + u.LastName,
                                           watchmen = w.FirstName + " " + w.LastName,
                                           flatno = up.FlatNo
                                       }).ToList();
                    //var visiterData = dbContext.Visiters.Include(u => u.VisitingUser).Include(u => u.Watchmen).Where(v => v.WatchmenId == watchId).Select(
                    //v => new
                    //{
                    //    v.Id,
                    //    v.Name,
                    //    v.PhoneNo,
                    //    photo = !string.IsNullOrEmpty(v.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{v.Photo}" : null,
                    //    v.EntryDate,
                    //    v.EntryTime,
                    //    v.ExitDate,
                    //    v.ExitTime,
                    //    v.VisitingUserId,
                    //    v.WatchmenId,
                    //    membername = v.VisitingUser.FirstName + " " + v.VisitingUser.LastName,
                    //    watchmen = v.Watchmen.FirstName + " " + v.Watchmen.LastName
                    //}).ToList();
                    if (visiterData == null || !visiterData.Any())
                    {
                        return NotFound(new { message = "No visiter record found !" });
                    }
                    return Ok(visiterData);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }
        }
        [HttpGet]
        [Route("getAllVisiterByMember")]
        public IActionResult getAllVisiterByMember()
        {
            try
            {
                var memberId = Request.Headers["memberId"].ToString();
                int memId = int.Parse(memberId);
                
                    var visiterData = (from v in dbContext.Visiters
                                       join u in dbContext.UserMasters on v.VisitingUserId equals u.Id
                                       join w in dbContext.UserMasters on v.WatchmenId equals w.Id
                                       join up in dbContext.UserPersonalDetails on u.Id equals up.UserId
                                       where v.VisitingUserId == memId
                                       select new
                                       {
                                           v.Id,
                                           v.Name,
                                           v.PhoneNo,
                                           photo = !string.IsNullOrEmpty(v.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{v.Photo}" : null,
                                           EntryDate = v.EntryDate.Value.ToString("dd-MM-yyyy"),
                                           v.EntryTime,
                                           ExitDate = v.ExitDate.Value.ToString("dd-MM-yyyy"),
                                           v.ExitTime,
                                           v.VisitingUserId,
                                           v.WatchmenId,
                                           membername = u.FirstName + " " + u.LastName,
                                           watchmen = w.FirstName + " " + w.LastName,
                                           flatno = up.FlatNo
                                       }).ToList();
                   
                    if (visiterData == null || !visiterData.Any())
                    {
                        return NotFound(new { message = "No visiter record found !" });
                    }
                    return Ok(visiterData);
               
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }
        }
        [HttpGet]
        [Route("getAllRecentVisiterByMember")]
        public IActionResult getAllRecentVisiterByMember()
        {
            try
            {
                var memberId = Request.Headers["memberId"].ToString();
                int memId = int.Parse(memberId);
                var today = DateOnly.FromDateTime(DateTime.Today);

                if (memId != null)
                {
                    var visiterData = (from v in dbContext.Visiters 
                                       join u in dbContext.UserMasters on v.VisitingUserId equals u.Id
                                       join w in dbContext.UserMasters on v.WatchmenId equals w.Id
                                       join up in dbContext.UserPersonalDetails on u.Id equals up.UserId
                                       where v.VisitingUserId == memId && v.EntryDate==today
                                       select new
                                       {
                                           v.Id,
                                           v.Name,
                                           v.PhoneNo,
                                           photo = !string.IsNullOrEmpty(v.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{v.Photo}" : null,
                                           EntryDate=v.EntryDate.Value.ToString("dd-MM-yyyy"),
                                           v.EntryTime,
                                           ExitDate=v.ExitDate.Value.ToString("dd-MM-yyyy"),
                                           v.ExitTime,
                                           v.VisitingUserId,
                                           v.WatchmenId,
                                           membername = u.FirstName + " " + u.LastName,
                                           watchmen = w.FirstName + " " + w.LastName,
                                           flatno = up.FlatNo
                                       }).ToList();

                    if (visiterData == null || !visiterData.Any())
                    {
                        return NotFound(new { message = "No visiter record found !" });
                    }
                    return Ok(visiterData);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }
        }
        [HttpGet]
        [Route("getVisiterById/{id:Int}")]
        public IActionResult getAllvisiterById(int id)
        {
            try {
                var visiterData = (from v in dbContext.Visiters 
                                   join u in dbContext.UserMasters on v.VisitingUserId equals u.Id
                                   join w in dbContext.UserMasters on v.WatchmenId equals w.Id
                                   join up in dbContext.UserPersonalDetails on u.Id equals up.UserId
                                   where v.Id == id
                                   select new
                                   {
                                       v.Id,
                                       v.Name,
                                       v.PhoneNo,
                                       photo = !string.IsNullOrEmpty(v.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{v.Photo}" : null,
                                       v.EntryDate,
                                       v.EntryTime,
                                       v.ExitDate,
                                       v.ExitTime,
                                       v.VisitingUserId,
                                       v.WatchmenId,
                                       membername = u.FirstName + " " + u.LastName,
                                       watchmen = w.FirstName + " " + w.LastName,
                                       flatno = up.FlatNo
                                   }).ToList();
                if (visiterData == null)
                {
                    return NotFound(new { message = "Visiter record not found." });
                }
                return Ok(visiterData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }

        }

        [HttpPost]
        public async Task<IActionResult> addVisiter(AddVisiterData vData)
        {
            try {
                string fileName = await _fileService.uploadFile(vData.Photo, "uploadimage");
                var visiterEntity = new Visiter
                {
                    VisitingUserId = vData.VisitingUserId,
                    WatchmenId = vData.WatchmenId,
                    Name = vData.Name,
                    PhoneNo = vData.PhoneNo,
                    Photo = fileName,
                    EntryDate = vData.EntryDate,
                    EntryTime = vData.EntryTime,
                    ExitDate = vData.ExitDate,
                    ExitTime = vData.ExitTime,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.Visiters.Add(visiterEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Visiter added succesfully" });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }

        }
        [HttpPut]
        [Route("updateVisiter/{id:int}")]
        public async Task<IActionResult> updateVisister(int id,UpdateVisiterData upData)
        {
            try
            {
                var checkData = dbContext.Visiters.Find(id);
                if (checkData == null)
                {
                    return NotFound(new { message = "Visiter not found !" });

                }
                if (upData.Photo != null)
                {
                    if (!string.IsNullOrEmpty(checkData.Photo))
                    {
                        var oldPath = Path.Combine("wwwroot/uploadimage", checkData.Photo);
                        if (System.IO.File.Exists(oldPath))
                        {
                            System.IO.File.Delete(oldPath);
                        }

                    }
                    string fileName = await _fileService.uploadFile(upData.Photo, "uploadimage");
                    checkData.Photo = fileName;
                }
                checkData.VisitingUserId = upData.VisitingUserId;
                checkData.Name = upData.Name;
                checkData.PhoneNo = upData.PhoneNo;
                checkData.EntryDate = upData.EntryDate;
                checkData.EntryTime = upData.EntryTime;
                checkData.ExitDate = upData.ExitDate;
                checkData.ExitTime = upData.ExitTime;
                checkData.UpdatedAt = DateTime.UtcNow;
                dbContext.SaveChanges();
                return Ok(new { message = "Visiter detail updated successfully" });

            }catch(Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }

        }
        [HttpGet]
        [Route("getAllMemebrForVisiter")]
        public IActionResult getAllMemberForVisiter()
        {
            try
            {
                var member=(from u in dbContext.UserMasters 
                            join up in dbContext.UserPersonalDetails on u.Id equals up.UserId
                            where u.Status == "Active" && u.GroupId==2
                            select new{
                            u.Id,
                            u.FirstName, 
                            u.LastName,
                            up.FlatNo
                }).ToList();
                if(member==null)
                {
                    return NotFound();
                }
                return Ok(member);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }
        }
        //[HttpDelete]
        //[Route("deleteVisiter/{id:int}")]
        //public IActionResult deleteVisiter(int id)
        //{
        //    try
        //    {
        //        var visiterData = dbContext.Visiters.FirstOrDefault(v=>v.Id==id);
        //        if (visiterData == null)
        //        {
        //            return NotFound(new {message="visiter not found!"});
        //        }
        //        dbContext.Visiters.Remove(visiterData);
        //        dbContext.SaveChanges();
        //        return Ok(new { message = "Visiter deleted succesafully" });
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

        //    }
        //}
    }
}
