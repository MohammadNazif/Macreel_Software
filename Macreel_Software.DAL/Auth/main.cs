using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macreel_Software.DAL.Auth
{
    public class main
    {
        public class RefreshTokenData
        {
            public int UserId { get; set; }
            public string RefreshToken { get; set; } = string.Empty;
            public DateTime Expiry { get; set; }
        }

    }
}
