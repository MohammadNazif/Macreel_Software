using System.Threading.Tasks;
using FirebaseAdmin.Messaging;

namespace Macreel_Software.Services.FirebaseNotification
{
    public class FirebaseNotificationService
    {
       
            public async Task<(bool IsSuccess, string Message)> SendNotificationAsync(string deviceToken, string title,string body)
            {
                if (string.IsNullOrWhiteSpace(deviceToken))
                {
                    return (false, "Device token is missing");
                }

                var message = new Message
                {
                    Token = deviceToken,
                    Notification = new Notification
                    {
                        Title = title,
                        Body = body
                    }
                };

                try
                {
                    var response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
                    return (true, response);
                }
                catch (FirebaseMessagingException ex)
                {
                  
                    return ex.MessagingErrorCode switch
                    {
                        MessagingErrorCode.Unregistered =>
                            (false, "FCM token is invalid or expired"),

                        MessagingErrorCode.InvalidArgument =>
                            (false, "Invalid FCM request or token"),

                        _ =>
                            (false, $"Firebase error: {ex.Message}")
                    };
                }
                catch (Exception ex)
                {
                  
                    return (false, $"Server error: {ex.Message}");
                }
            }
     }
    
}
