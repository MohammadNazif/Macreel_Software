using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macreel_Software.Contracts.DTOs
{
    public class sendEmailForRegistration
    {
        public int? id { get; set; }
        public string? accessId { get; set; }
        public string? email { get; set; }
        public DateTime? reg_date { get; set; }
    }
}
