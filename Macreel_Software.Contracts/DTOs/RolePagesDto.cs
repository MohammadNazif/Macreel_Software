using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macreel_Software.Contracts.DTOs
{
    public class RolePagesDto
    {
        public int roleId { get; set; }
        public string roleName { get; set; }
        public List<PageDto> pages { get; set; } = new();
    }
    public class PageDto
    {
        public int pageId { get; set; }
        public string pageName { get; set; }
        public string pageUrl { get; set; }
    }
}
