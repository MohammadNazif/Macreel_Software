using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macreel_Software.Contracts.DTOs
{
    public class AssignedTaskDto
    {
        public int? projectId { get; set; }
        public string? taskTitle { get; set; }
        public string? description { get; set; }
        public int? taskStatus { get; set; }
        public DateTime? assignedDate { get; set; }
        public DateTime? completedDate { get; set; }
    }
}
