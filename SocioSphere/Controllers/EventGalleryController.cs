using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MimeKit.Tnef;
using SocioSphere.Models.Entity;
using SocioSphere.Models.Services;
using SocioSphere.Models.UserDataModels.AddUserData;

namespace SocioSphere.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventGalleryController : ControllerBase
    {
        private readonly SociosphereContext dbContext; //database entity variable
        private readonly IFileService fileService;
        //contruct of this controller
        public EventGalleryController(SociosphereContext dbContext, IFileService fileService)
        {
            this.dbContext = dbContext;
            this.fileService = fileService;
        }

        [HttpGet]
        public IActionResult getAllGallaeryData()
        {
            try
            {
                var galleryData = (from eg in dbContext.EventGalleries
                                   join e in dbContext.EventMasters on eg.EventId equals e.Id
                                   join u in dbContext.UserMasters on eg.UserId equals u.Id
                                   where eg.EventId == e.Id
                                   select new
                                   {
                                       eg.Id,
                                       eg.Description,
                                       Photo = !string.IsNullOrEmpty(eg.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{eg.Photo}" : null,
                                       eg.CreatedAt,
                                       e.EventName,
                                       e.EventDate,
                                       Username = u.FirstName + " " + u.LastName
                                   })
                              .GroupBy(x => new { x.EventName, x
                              
                              .EventDate })
                              .OrderByDescending(g => g.Key.EventDate) // descending order
                              .Select(g => new
                              {
                                  EventName = g.Key.EventName,
                                  EventDate = g.Key.EventDate,
                                  Photos = g.Select(p => new
                                  {
                                      p.Id,
                                      p.Description,
                                      p.Photo,
                                      p.CreatedAt,
                                      p.Username
                                  }).ToList()
                              })
                              .ToList();
                if (galleryData==null || !galleryData.Any())
                {
                    return NotFound(new {message="Gallery record not found"});

                }
                return Ok(galleryData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }
        //particular member gallery data
        [HttpGet]
        [Route("getGalleryByMember")]
        public IActionResult getAllGalleryDataByMember()
        {
            try
            {
                string memId = Request.Headers["memberId"].ToString();
                int memberId = int.Parse(memId);
                if (memberId != null)
                {

                    var galleryData = (from eg in dbContext.EventGalleries where eg.UserId==memberId
                                       join e in dbContext.EventMasters on eg.EventId equals e.Id
                                       join u in dbContext.UserMasters on eg.UserId equals u.Id
                                       where eg.EventId == e.Id
                                       select new
                                       {
                                           eg.Id,
                                           eg.Description,
                                           Photo = !string.IsNullOrEmpty(eg.Photo) ? $"{Request.Scheme}://{Request.Host}/uploadimage/{eg.Photo}" : null,
                                           eg.CreatedAt,
                                           e.EventName,
                                           e.EventDate,
                                           Username = u.FirstName + " " + u.LastName
                                       })
                              .GroupBy(x => new { x.EventName, x.EventDate })
                              .OrderByDescending(g => g.Key.EventDate) // descending order
                              .Select(g => new
                              {
                                  EventName = g.Key.EventName,
                                  EventDate = g.Key.EventDate,
                                  Photos = g.Select(p => new
                                  {
                                      p.Id,
                                      p.Description,
                                      p.Photo,
                                      p.CreatedAt,
                                      p.Username
                                  }).ToList()
                              })
                              .ToList();
                    if (galleryData == null || !galleryData.Any())
                    {
                        return NotFound(new { message = "Gallery record not found" });

                    }
                    return Ok(galleryData);

                }
                else
                {
                    return NotFound();
                }
             }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }

        }
        [HttpPost]
        public async Task<IActionResult> addEventGallery(AddGalleryData addGallery)
        {
            try
            {
                string fileName = await fileService.uploadFile(addGallery.Photo, "uploadimage");
                var galleryEntity = new EventGallery
                {
                    UserId = addGallery.UserId,
                    EventId = addGallery.EventId,
                    Description = addGallery.Description,
                    Photo = fileName,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = null,
                };
                dbContext.EventGalleries.Add(galleryEntity);
                dbContext.SaveChanges();
                return Ok(new {message="Photo added Successfully"});
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                return StatusCode(500, new { message = "Something went wrong.Please try again!" });

            }
        }

        [HttpDelete]
        [Route("deleteGalleryImage/{id:int}")]
        public IActionResult deleteGalleryData(int id) {
            try
            {
                var galleryData = dbContext.EventGalleries.FirstOrDefault(v => v.Id == id);
                if (galleryData == null)
                {
                    return NotFound(new { message = "Gallery data not found!" });
                }
                else
                {
                    if (galleryData.Photo != null)
                    {
                        var oldPath = Path.Combine("wwwroot/uploadimage", galleryData.Photo);
                        if (System.IO.File.Exists(oldPath))
                        {
                            System.IO.File.Delete(oldPath);
                        }
                    }
                }   
                    dbContext.EventGalleries.Remove(galleryData);
                dbContext.SaveChanges();
                return Ok(new { message = "Image deleted succesafully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Something went wrong.Please try again!", error = ex.Message });

            }
        }

    }
}
