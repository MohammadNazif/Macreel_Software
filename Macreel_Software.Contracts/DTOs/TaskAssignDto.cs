using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Macreel_Software.Contracts.DTOs
{
    public class TaskAssignDto
    {
        public int id { get; set; }
        public int? empId { get; set; }
        public string? title { get; set; }
        public string? description { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string? document1Path { get; set; }
        public string? document2Path { get; set; }
        public string? empName { get; set; }
        public DateTime? assignedDate { get; set; }
        public string? taskStatus { get; set; }
        public string assignedByName { get; set; } = string.Empty;
    }

   public class AdminDashboardCountDto
    {
        public  int? TotalProjects { get; set; }
        public  int? OngoingProjects { get; set; }
        public  int? TotalEmployees { get; set; }
        public  int? AbsentEmployee { get; set; }
        public  int? TotalTasks { get; set; }
        public  int? CompletedTask { get; set; }
        public  int? LeaveRequest { get; set; }
        public  int? UpcomingLeaves { get; set; }
    }
}
