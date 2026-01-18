using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macreel_Software.Models.Employee
{
    public class EmployeeData
    {
        public int? id { get; set; }
        public int empId { get; set; }
        public int ruleBookId { get; set; }
        public string response { get; set; }
    }

    public class assignedLeave
    {
        public int? id { get; set; }
        public int? empId { get; set; }
        public int? noOfLeave { get; set; }
        public int? leaveId { get; set; }
        public string? leaveName { get; set; }
        public string? description { get; set; }
    }
    public class applyLeave
    {
        public int id { get; set; }
        public int? empId { get; set; }
        public DateTime? fromDate { get; set; }
        public DateTime? toDate { get; set; }
        public int? leaveTypeId { get; set; }
        public string? description { get; set; }


        public string? empName { get; set; }
        public DateTime? applieddate { get; set; }
        public int? leaveCount { get; set; }
        public string? leaveName { get; set; }

    }
}
