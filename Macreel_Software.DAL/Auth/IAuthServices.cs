using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macreel_Software.Models;
using Microsoft.AspNetCore.Http;

namespace Macreel_Software.DAL.Auth
{
    public interface IAuthServices
    {

         Task<UserData?> ValidateUserAsync(string userName, string password);
         Task<bool> SaveRefreshTokenAsync(int userId, string refreshToken, DateTime expiry);



      

    }
    
}
