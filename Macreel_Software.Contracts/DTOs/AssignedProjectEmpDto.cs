using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macreel_Software.Contracts.DTOs
{
    public class AssignedProjectEmpDto
    {
        public int? Id { get; set; }
        public string? Category { get; set; }
        public string? ProjectTitle { get; set; }
        public string? Description { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? AssignDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public string? EmpName { get; set; }
        public string? Mobile { get; set; }
        public string? Designation { get; set; }
    }
}
