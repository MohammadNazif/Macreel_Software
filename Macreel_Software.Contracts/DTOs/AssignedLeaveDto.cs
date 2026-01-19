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
}
