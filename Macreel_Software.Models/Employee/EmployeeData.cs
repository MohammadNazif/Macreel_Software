using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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
        public IFormFile? uploadFile { get; set; }
        public string? fileName { get; set; }
        public int id { get; set; }
        public int? empId { get; set; }
        public DateTime? fromDate { get; set; }
        public DateTime? toDate { get; set; }
        public int? leaveTypeId { get; set; }
        public string? description { get; set; }
        public string? status { get; set; }
        public int? statuscode { get; set; }
        public string? empName { get; set; }
        public DateTime? applieddate { get; set; }
        public int? leaveCount { get; set; }
        public string? leaveName { get; set; }
        public string? reason { get; set; }

    }
    public class Dashboard
    {
        public int? TotalProjects { get; set; }
        public int? OngoingProjects { get; set; }
        public int? AssignedLeave { get; set; }
        public int? RequestedLeave { get; set; }
        public int? TotalTasks { get; set; }
        public int? CompletedTasks { get; set; }
    }
}
