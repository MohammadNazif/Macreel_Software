using Macreel_Software.DAL;
using Macreel_Software.DAL.Auth;
using Macreel_Software.Models;
using Macreel_Software.Services.FileUpload.Services;
using Macreel_Software.Services.MailSender;
using Microsoft.AspNetCore.Mvc;

namespace Macreel_Software.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authServices;
        private readonly JwtTokenProvider _jwtProvider;
        private readonly PasswordEncrypt _pass;

        public AuthController(IAuthServices authServices,JwtTokenProvider jwtProvider, PasswordEncrypt pass)
        {
            _authServices = authServices;
            _jwtProvider = jwtProvider;
            _pass = pass;

        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] LoginRequest model)
        {
            if (string.IsNullOrWhiteSpace(model.UserName) || string.IsNullOrWhiteSpace(model.Password))
            {
                return BadRequest(new { Status = 400, Message = "Username and password are required." });
            }

            var user = await _authServices.ValidateUserAsync(model.UserName, model.Password);

            if (user == null)
                return Unauthorized(new { Status = 401, Message = "Invalid username or password." });

            var accessToken = _jwtProvider.CreateToken(user);
            var refreshToken = _jwtProvider.GenerateRefreshToken();
            var refreshExpire = DateTime.UtcNow.AddDays(1);

            await _authServices.SaveRefreshTokenAsync(user.UserId, refreshToken, refreshExpire);

            return Ok(new
            {
                Status = 200,
                Message = "Login successful",
                Data = new { token = accessToken }
            });
        }



    }
}
