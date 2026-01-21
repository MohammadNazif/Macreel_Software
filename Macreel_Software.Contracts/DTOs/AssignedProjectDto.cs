using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macreel_Software.Contracts.DTOs
{
    public class AssignedProjectDto
    {
        public int? id { get; set; }
        public string? projectName { get; set; }
        public DateTime? assignDate { get; set; }
        public DateTime? completionDate { get; set; }
        public string? projectStatus { get; set; }
    }
}
