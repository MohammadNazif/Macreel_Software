using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macreel_Software.Contracts.DTOs
{
    public class AssignedProjectEmpListDto
    {
        public int? id { get; set; }
        public int? projectId { get; set; }
        public int? empId { get; set; }
        public int? approveStatus { get; set; }
        public string? empName { get; set; }
        public string? designationName { get; set; }
    }
}
