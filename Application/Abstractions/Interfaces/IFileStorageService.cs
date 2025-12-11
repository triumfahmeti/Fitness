using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Fitness.Application.Abstractions.Interfaces
{
    public interface IFileStorageService
    {
        /// <summary>
        /// Saves an uploaded image and returns a public URL path (e.g., /images/{file}).
        /// Returns null if file is null or empty.
        /// </summary>
        Task<string?> SaveImageAsync(IFormFile? file, string subfolder = "images");
    }
}