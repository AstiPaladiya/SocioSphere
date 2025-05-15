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
    public class SuggestionController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable
        private readonly IFileService fileService;
        //contruct of this controller
        public SuggestionController(SociosphereContext dbContext, IFileService fileService)
        {
            this.dbContext = dbContext;
            this.fileService = fileService;
        }

        [HttpPost]
        public async Task<IActionResult> addSuggestion(AddSuggestionData addData)
        {
            try
            {
                string fileName;
                if (addData.Photo != null)
                {
                    fileName = await fileService.uploadFile(addData.Photo, "uploadimage");
                }
                else
                {
                    fileName = null;
                }
                var comEntity = new SuggestionMaster
                {
                   Userid=addData.Userid,
                   SuggestionTitle=addData.SuggestionTitle,
                   Description=addData.Description,
                   Photo=fileName,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null
                };
                dbContext.SuggestionMasters.Add(comEntity);
                dbContext.SaveChanges();
                return Ok(new { message = "Suggestion added successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        [HttpDelete]
        [Route("deleteSuggestion/{id:int}")]
        public IActionResult deleteSuggestion(int id)
        {
            try
            {
                var sugg=dbContext.SuggestionMasters.Find(id);
                if(sugg == null)
                {
                    return NotFound();
                }
                var suggVote=dbContext.SuggestionVotes.FirstOrDefault(v=>v.SuggestionId==sugg.Id);
                if(suggVote!=null)
                {
                    dbContext.SuggestionVotes.Remove(suggVote);
                    dbContext.SaveChanges();
                }
                dbContext.SuggestionMasters.Remove(sugg);
                dbContext.SaveChanges();
                return Ok(new { message = "Suggestion deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        //Not working add left join and then new code
        //[HttpGet]
        //[Route("displayAllSuggestion")]
        //public IActionResult getAllSuggestion()
        //{
        //    try
        //    {
        //        var sugData = (from s in dbContext.SuggestionMasters
        //                       join u in dbContext.UserMasters on s.Userid equals u.Id
        //                       join sv in dbContext.SuggestionVotes on  s.Id equals sv.SuggestionId

        //                       select new
        //                       {
        //                           s.Id,
        //                           s.Userid,
        //                           s.SuggestionTitle,
        //                           s.Description,
        //                           photo = !string.IsNullOrEmpty(s.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{s.Photo}" : null,
        //                           userName = s.User.FirstName + " " + s.User.LastName,
        //                           totalLikes = s.SuggestionVotes.Count(l => l.Isliked.HasValue && l.Isliked == true),
        //                           totalDislike = s.SuggestionVotes.Count(d => d.Isliked.HasValue && d.Isliked == false),
        //                           DateOnly = EF.Functions.DateDiffDay(DateTime.MinValue, s.CreatedAt), // For comparisons, not display
        //                           s.CreatedAt
        //                       }).ToList();
        //        return  Ok(sugData);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error: {ex.Message}");
        //        return StatusCode(500, new { message = "Something went wrong.Please try again!" });

        //    }
        //}
        [HttpGet]
        [Route("displayAllSuggestion")]
        public IActionResult getAllSuggestion()
        {
            try
            {
                // First, pull all required data to memory
                var rawData = (from s in dbContext.SuggestionMasters
                               join u in dbContext.UserMasters on s.Userid equals u.Id
                               join sv in dbContext.SuggestionVotes on s.Id equals sv.SuggestionId into votegroup
                               from vote in votegroup.DefaultIfEmpty()
                               select new
                               {
                                   Suggestion = s,
                                   User = u,
                                   Vote = vote
                               }).ToList(); // ← this forces in-memory processing from here

                // Then group and project
                var sugData = rawData
                    .GroupBy(x => new { x.Suggestion, x.User })
                    .Select(g => new
                    {
                        g.Key.Suggestion.Id,
                        g.Key.Suggestion.Userid,
                        g.Key.Suggestion.SuggestionTitle,
                        g.Key.Suggestion.Description,
                        photo = !string.IsNullOrEmpty(g.Key.Suggestion.Photo)
                            ? $"{Request.Scheme}://{Request.Host}/uploadimage/{g.Key.Suggestion.Photo}"
                            : null,
                        userName = g.Key.User.FirstName + " " + g.Key.User.LastName,
                        totalLikes = g.Count(x => x.Vote != null && x.Vote.Isliked == true),
                        totalDislike = g.Count(x => x.Vote != null && x.Vote.Isliked == false),
                        crtAT = g.Key.Suggestion.CreatedAt
                    })
                    .ToList();

                return Ok(sugData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }

        [HttpPost]
        [Route("addSuggestionVote")]
        public IActionResult addSuggestionVote(AddSuggestionVoteData sVoteData)
        {
            try
            {
                var existingvote=dbContext.SuggestionVotes.FirstOrDefault(s=>s.SuggestionId == sVoteData.SuggestionId && s.UserId==sVoteData.UserId);
                if (existingvote != null) { 
                    existingvote.Isliked=sVoteData.Isliked;
                    existingvote.UpdatedAt=DateTime.UtcNow;
                    dbContext.SuggestionVotes.Update(existingvote);
                } else
                {
                    var vote = new SuggestionVote
                    {
                        SuggestionId = sVoteData.SuggestionId,
                        UserId = sVoteData.UserId,
                        Isliked = sVoteData.Isliked,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = null,
                    };
                    dbContext.SuggestionVotes.Add(vote);
                }
                dbContext.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }

        //recent suggestion
        [HttpGet]
        [Route("allRecentSuggestion")]
        public IActionResult getAllRecentSuggestion()
        {
            try
            {
                // First, pull all required data to memory
                var rawData = (from s in dbContext.SuggestionMasters
                               join u in dbContext.UserMasters on s.Userid equals u.Id
                               join sv in dbContext.SuggestionVotes on s.Id equals sv.SuggestionId into votegroup
                               
                               from vote in votegroup.DefaultIfEmpty()
                               select new
                               {
                                   Suggestion = s,
                                   User = u,
                                   Vote = vote
                               }).ToList(); // ← this forces in-memory processing from here

                // Then group and project
                var sugData = rawData
                    .GroupBy(x => new { x.Suggestion, x.User })
                    .OrderByDescending(g=>g.Key.Suggestion.CreatedAt)
                    .Select(g => new
                    {
                        g.Key.Suggestion.Id,
                        g.Key.Suggestion.Userid,
                        g.Key.Suggestion.SuggestionTitle,
                        g.Key.Suggestion.Description,
                        photo = !string.IsNullOrEmpty(g.Key.Suggestion.Photo)
                            ? $"{Request.Scheme}://{Request.Host}/uploadimage/{g.Key.Suggestion.Photo}"
                            : null,
                        userName = g.Key.User.FirstName + " " + g.Key.User.LastName,
                        totalLikes = g.Count(x => x.Vote != null && x.Vote.Isliked == true),
                        totalDislike = g.Count(x => x.Vote != null && x.Vote.Isliked == false),
                        crtAT = g.Key.Suggestion.CreatedAt
                    })
                    .ToList();

                return Ok(sugData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }
        //Most liked suggestion
        [HttpGet]
        [Route("allLikedSuggestion")]
        public IActionResult getAllLikedSuggestion()
        {
            try
            {
                // First, pull all required data to memory
                var rawData = (from s in dbContext.SuggestionMasters
                               join u in dbContext.UserMasters on s.Userid equals u.Id
                               join sv in dbContext.SuggestionVotes on s.Id equals sv.SuggestionId into votegroup

                               from vote in votegroup.DefaultIfEmpty()
                               select new
                               {
                                   Suggestion = s,
                                   User = u,
                                   Vote = vote
                               }).ToList(); // ← this forces in-memory processing from here

                // Then group and project
                var sugData = rawData
                    .GroupBy(x => new { x.Suggestion, x.User })
                    .OrderByDescending(g => g.Count(x => x.Vote != null && x.Vote.Isliked == true))
                    .Select(g => new
                    {
                        g.Key.Suggestion.Id,
                        g.Key.Suggestion.Userid,
                        g.Key.Suggestion.SuggestionTitle,
                        g.Key.Suggestion.Description,
                        photo = !string.IsNullOrEmpty(g.Key.Suggestion.Photo)
                            ? $"{Request.Scheme}://{Request.Host}/uploadimage/{g.Key.Suggestion.Photo}"
                            : null,
                        userName = g.Key.User.FirstName + " " + g.Key.User.LastName,
                        totalLikes = g.Count(x => x.Vote != null && x.Vote.Isliked == true),
                        totalDislike = g.Count(x => x.Vote != null && x.Vote.Isliked == false),
                        crtAT = g.Key.Suggestion.CreatedAt
                    })
                    .ToList();

                return Ok(sugData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }
        }
        [HttpGet]
        [Route("allSuggestionByMember")]
        public IActionResult allSuggestionByParMember()
        {
            try
            {
                var memberId = Request.Headers["memberId"].ToString();
                int memId = int.Parse(memberId);
                if(memId!=null)
                {
                    // First, pull all required data to memory
                    var rawData = (from s in dbContext.SuggestionMasters
                                   join u in dbContext.UserMasters on s.Userid equals u.Id
                                   join sv in dbContext.SuggestionVotes on s.Id equals sv.SuggestionId into votegroup
                                   where s.Userid== memId
                                   from vote in votegroup.DefaultIfEmpty()
                                   select new
                                   {
                                       Suggestion = s,
                                       User = u,
                                       Vote = vote
                                   }).ToList(); // ← this forces in-memory processing from here

                    // Then group and project
                    var sugData = rawData
                        .GroupBy(x => new { x.Suggestion, x.User })
                        .Select(g => new
                        {
                            g.Key.Suggestion.Id,
                            g.Key.Suggestion.Userid,
                            g.Key.Suggestion.SuggestionTitle,
                            g.Key.Suggestion.Description,
                            photo = !string.IsNullOrEmpty(g.Key.Suggestion.Photo)
                                ? $"{Request.Scheme}://{Request.Host}/uploadimage/{g.Key.Suggestion.Photo}"
                                : null,
                            userName = g.Key.User.FirstName + " " + g.Key.User.LastName,
                            totalLikes = g.Count(x => x.Vote != null && x.Vote.Isliked == true),
                            totalDislike = g.Count(x => x.Vote != null && x.Vote.Isliked == false),
                            crtAT = g.Key.Suggestion.CreatedAt
                        })
                        .ToList();
                    return Ok(sugData);
                }
                else
                {
                    return NotFound();
                }

              
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong. Please try again!" });
            }

        }

    }
}
