//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore.Storage.Json;
//using SocioSphere.Models.Entity;
//using SocioSphere.Models.UserDataModels.AddUserData;
//using SocioSphere.Models.UserDataModels.UpdateUserData;

//namespace SocioSphere.Controllers
//{
//    //localhost:5847/api/CommitteMember
//    [Route("api/[controller]")]
//    [ApiController]

//    public class CommitteMemberController : ControllerBase
//    {
//        private readonly SociosphereContext dbContext;

//        public CommitteMemberController(SociosphereContext dbContext)
//        {
//            this.dbContext = dbContext;
//        }
//        [HttpGet]
//        public IActionResult getAllCommitteMember() {
//            try
//            {
//                var allCommitte = dbContext.CommitteMemberRecords.ToList();
//                if (allCommitte == null || !allCommitte.Any())
//                {
//                    return NotFound(new { message = "No society committe member record found!" });
//                }
//                return Ok(allCommitte);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });
//            }
//        }
//        [HttpGet]
//        [Route("{id:int}")]
//        public IActionResult getCommitteMember(int id) {
//            try
//            {
//                var committe = dbContext.CommitteMemberRecords.Find(id);
//                if (committe == null)
//                {
//                    return NotFound(new { message = "Society committe record not found." });
//                }
//                return Ok(committe);
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error: {ex.Message}");
//                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
//            }
//        }
//        [HttpGet]
//        [Route("committeType")]
//        public IActionResult getCommitteActiveType()
//        {
//            try
//            {
//                var committeType = dbContext.SocietyCommitteMasters
//                                 .Where(c => c.Status == "Active")
//                                 .Select(c => new { c.Id, c.CommitteName })
//                                 .ToList();
//                return Ok(committeType);
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error: {ex.Message}");
//                return StatusCode(500, new { message = "Something went wrong. Please try again!" });

//            }
//        }
//        //[HttpGet]
//        //[Route("activeUser")]
//        //public IActionResult getActiveUser()
//        //{
//        //    try
//        //    {
//        //        var committeType = dbContext.UserMasters
//        //                         .Where(c => cs.Status == "Active",c=>)
//        //                         .Select(c => new { c.Id, c.CommitteName })
//        //                         .ToList();
//        //        return Ok(committeType);
//        //    }
//        //    catch (Exception ex)
//        //    {
//        //        Console.WriteLine($"Error: {ex.Message}");
//        //        return StatusCode(500, new { message = "Something went wrong. Please try again!" });

//        //    }
//        //}
//        [HttpPost]
//        public IActionResult addCommitteMember(AddCommitteMemberData data)

//        {
//            try
//            {
//                var memberEntity = new CommitteMemberRecord
//                {
//                    CommittieTypeId = data.CommittieTypeId,
//                    UserId = data.UserId,
//                    StartDate = data.StartDate,
//                    EndDate = data.EndDate,
//                    Status = "Active",
//                    CreatedAt = DateTime.UtcNow,
//                    UpdatedAt = null
//                };
//                dbContext.CommitteMemberRecords.Add(memberEntity);
//                dbContext.SaveChanges();
//                return Ok(new { message = "Society committe member added successfully !" });
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error: {ex.Message}");
//                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

//            }
//        }
//        [HttpPut]
//        [Route("{id:int}")]
//        public IActionResult updateCommitteMember(int id, UpdateCommitteMemberData updateData)
//        {
//            try
//            {
//                var committeMember = dbContext.CommitteMemberRecords.Find(id);
//                if (committeMember == null)
//                {
//                    return NotFound(new { message = "Society Committe record Data not found" });
//                }
//                committeMember.CommittieTypeId = updateData.CommittieTypeId;
//                committeMember.UserId = updateData.UserId;
//                committeMember.StartDate = updateData.StartDate;
//                committeMember.UpdatedAt = DateTime.UtcNow;
//                dbContext.SaveChanges();
//                return Ok(new { message = "Society Committe updated succesfully !" });
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error: {ex.Message}");
//                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

//            }
//        }
//        [HttpPut]
//        [Route("toggleStatus/{id:int}")]
//        public IActionResult toggleCommitteMemberStatus(int id,UpdateCommitteMemberData updateData)
//        {
//            try
//            {
//                var committeMember = dbContext.CommitteMemberRecords.Find(id);
//                if (committeMember == null)
//                {
//                    return NotFound(new { message = "Society Committe Data not found" });

//                }
//                if (committeMember.Status == "Active")
//                {

          
//                    committeMember.Status = "Block";
//                }
//                else
//                {
//                    committeMember.Status = "Active";
//                }
//                committeMember.EndDate=updateData.EndDate;
//                committeMember.UpdatedAt = DateTime.UtcNow;
//                dbContext.SaveChanges();
//                return Ok(new { message = $"Society committe status {committeMember.Status} successfully!" });
//            }
//            catch (Exception ex)
//            {
//                Console.WriteLine($"Error: {ex.Message}");
//                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

//            }
//        }

//    }
//}
