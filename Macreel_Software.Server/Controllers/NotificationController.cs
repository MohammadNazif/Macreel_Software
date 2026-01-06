using Macreel_Software.Services.FirebaseNotification;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Macreel_Software.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly FirebaseNotificationService _firebase;

        public NotificationController(FirebaseNotificationService firebase)
        {
            _firebase = firebase;
        }

        [HttpPost("sendNotification")]
        public async Task<IActionResult> Send()
        {
            var token = "DEVICE_FCM_TOKEN";

            var result = await _firebase.SendNotificationAsync(token,"Hello 👋","Firebase from ASP.NET Core");

            if (!result.IsSuccess)
            {
                return Ok(new
                {
                    success = false,
                    message = result.Message
                });
            }

            return Ok(new
            {
                success = true,
                firebaseMessageId = result.Message
            });
        }
    }
}
