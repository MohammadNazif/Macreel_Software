using Macreel_Software.DAL;
using Macreel_Software.DAL.Auth;
using Macreel_Software.Models;
using Macreel_Software.Services.MailSender;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Macreel_Software.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthServices _authServices;
        private readonly JwtTokenProvider _jwtProvider;

        public AuthController(IAuthServices authServices,JwtTokenProvider jwtProvider, PasswordEncrypt pass)
        {
            _authServices = authServices;
            _jwtProvider = jwtProvider;
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
            var refreshExpire = DateTime.UtcNow.AddDays(2);

            await _authServices.SaveRefreshTokenAsync(user.UserId, refreshToken, refreshExpire);

            Response.Cookies.Append("access_token", accessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(30)
            });

            Response.Cookies.Append("refresh_token", refreshToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(2)
            });

            return Ok(new
            {
                Status = 200,
                Message = "Login successful",
                Data = new { token = accessToken }
            });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refresh_token"];
            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized("Refresh token missing");

            var tokenData = await _authServices.GetRefreshTokenAsync(refreshToken);
            if (tokenData == null || tokenData.Expiry < DateTime.UtcNow)
                return Unauthorized("Invalid or expired refresh token");

            var user = await _authServices.GetUserByIdAsync(tokenData.UserId);
            if (user == null)
                return Unauthorized();

            // Generate new access token
            var newAccessToken = _jwtProvider.CreateToken(user);

            // Set new access token cookie
            Response.Cookies.Append("access_token", newAccessToken, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,               // prod
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(30)
            });

            return Ok(new { message = "Token refreshed",token = newAccessToken });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refresh_token"];
            if (!string.IsNullOrEmpty(refreshToken))
                await _authServices.RevokeRefreshTokenAsync(refreshToken);

            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");

            return Ok();
        }
        [HttpGet("me")]
        public IActionResult Me()
        {
            var userId = User.FindFirst("UserId")?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            return Ok(new
            {
                userId,
                role
            });
        }

    }
}
