
using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Macreel_Software.Services.FileUpload.Services
{

    public class FileUploadService
    {
        private readonly string _rootPath;

        public FileUploadService()
        {
            _rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        }

        /// <summary>
        /// Step 1: Sirf validate karega + unique relative path generate karega
        /// Disk pe kuch bhi write nahi karega
        /// </summary>
        public string ValidateAndGeneratePath(
            IFormFile file,
            string folderName,
            string[] allowedExtensions,
            long maxFileSize = 10485760)
        {
            if (file == null || file.Length == 0)
                throw new Exception("File is empty");

            if (file.Length > maxFileSize)
                throw new Exception("File size exceeded");

            var extension = Path.GetExtension(file.FileName);

            if (allowedExtensions != null &&
                !allowedExtensions.Any(x =>
                    x.Equals(extension, StringComparison.OrdinalIgnoreCase)))
            {
                throw new Exception($"File type {extension} is not allowed");
            }

            var uniqueFileName = $"{Guid.NewGuid()}{extension}";

            return Path.Combine("uploads", folderName, uniqueFileName)
                       .Replace("\\", "/");
        }

        /// <summary>
        /// Step 2: Actual file upload
        /// Only if db insertion success
        /// </summary>
        public async Task UploadAsync(IFormFile file, string relativePath)
        {
            if (file == null)
                throw new Exception("File is null");

            var fullPath = Path.Combine(_rootPath, relativePath);

            var directory = Path.GetDirectoryName(fullPath);
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory!);

            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);
        }
    }
}
