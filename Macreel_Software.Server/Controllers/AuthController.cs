using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Macreel_Software.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public AuthController()
        {
        }
        [HttpPost("login")]
        public IActionResult Login()
        {
            // Placeholder for login logic
            return Ok(new { message = "Login successful" });
        }

    }
}
