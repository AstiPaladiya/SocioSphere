namespace SocioSphere.Models.Services
{
    public interface IFileService
    {
        Task<string> uploadFile(IFormFile file,string folderName);
    }
    public class UploadFileService:IFileService
    {
        private readonly IWebHostEnvironment _env;
        public UploadFileService(IWebHostEnvironment env) { 
            _env = env;
        }
        public async Task<string> uploadFile(IFormFile file, string folderName)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }
            var uploadFolder=Path.Combine(_env.WebRootPath,"uploadimage");
            if (!Directory.Exists(uploadFolder)) { 
                   Directory.CreateDirectory(uploadFolder);
            }
            var originalName=Path.GetFileName(file.FileName);
            var fileWithoutSp = originalName.Replace(" ", "");
            var uniqueFileName=$"{Guid.NewGuid()}_{fileWithoutSp}";
            var filePath=Path.Combine(uploadFolder, uniqueFileName);
            using(var stream=new FileStream(filePath,FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return uniqueFileName;
        }
        
    }
}
