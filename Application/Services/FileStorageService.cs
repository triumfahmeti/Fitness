using System;
using System.IO;
using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting;

namespace Fitness.Application.Services
{
    public class FileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;

        public FileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string?> SaveImageAsync(IFormFile? file, string subfolder = "images")
        {
            if (file == null || file.Length == 0)
                return null;

            // Normalize subfolder (strip leading slashes)
            subfolder = (subfolder ?? "images").Trim().TrimStart('/', '\\');

            // Resolve the web root path where static files are served from
            var webRoot = _env.WebRootPath;
            if (string.IsNullOrWhiteSpace(webRoot))
            {
                webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            }

            var folder = Path.Combine(webRoot, subfolder);
            Directory.CreateDirectory(folder);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}{ext}";
            var path = Path.Combine(folder, fileName);

            using (var stream = File.Create(path))
            {
                await file.CopyToAsync(stream);
            }

            // Return a URL path that StaticFiles can serve
            return $"/{subfolder}/{fileName}";
        }
    }
}