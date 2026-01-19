using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macreel_Software.Contracts.DTOs
{
    public class AssignedLeaveDto
    {
        public string? LeaveType { get; set; }      // leaveType
        public int AssignedLeave { get; set; }      // assignedLeave
        public int UsedLeave { get; set; }          // usedLeave
        public int RemainingLeave { get; set; }     // remainingLeave
    }


    public class allAssignedLeave
    {
        public int? id { get; set; }
        public int? EmpId { get; set; }
        public string? empName { get; set; }
        public int? empCode { get; set; }   // "10,5,2"
        public int? designationId { get; set; }     // "CL,SL,PL"
        public string? designationName { get; set; }     // "CL,SL,PL"
        public int? CLTotal { get; set; }
        public int? CLUsed { get; set; }
        public int? CLRemaining { get; set; }

        public int? ELTotal { get; set; }
        public int? ELUsed { get; set; }
        public int? ELRemaining { get; set; }

        public int? SLTotal { get; set; }
        public int? SLUsed { get; set; }
        public int? SLRemaining { get; set; }
    }
}
