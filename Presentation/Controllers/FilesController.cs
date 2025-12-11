using System.Threading.Tasks;
using Fitness.Application.Abstractions.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Fitness.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {
        private readonly IFileStorageService _storage;

        public FilesController(IFileStorageService storage)
        {
            _storage = storage;
        }

        // POST api/Files/upload
        [HttpPost("upload")]
        [RequestSizeLimit(100_000_000)] // allow larger files like videos (~100MB)
        public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromQuery] string subfolder = "images")
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var targetFolder = string.IsNullOrWhiteSpace(subfolder) ? "images" : subfolder.Trim();
            var url = await _storage.SaveImageAsync(file, targetFolder);
            if (string.IsNullOrWhiteSpace(url))
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save file");

            // Return the raw URL string to avoid anonymous type issues
            return Ok(url);
        }
    }
}