using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macreel_Software.Models;
using Macreel_Software.Models.Master;
using Microsoft.AspNetCore.Http;

namespace Macreel_Software.DAL.Admin
{
    public interface IAdminServices
    {
        Task<string> InsertEmployeeRegistrationData(employeeRegistration data);
        Task<List<ReportingManger>> GetAllReportingManager();
         Task<ApiResponse<List<employeeRegistration>>> GetAllEmpData(string? searchTerm,
          int? pageNumber,
          int? pageSize);
        Task<bool> deleteEmployeeById(int id);
        Task<ApiResponse<List<employeeRegistration>>> GetAllEmpDataById(int id);
        Task<bool> UpdateEmployeeRegistrationData(employeeRegistration data);

        Task<int> InsertLeave(Leave data);
        Task<ApiResponse<List<Leave>>> getAllLeave(string? searchTerm, int? pageNumber, int? pageSize);
        Task<ApiResponse<List<Leave>>> getAllLeaveById(int id);
        Task<bool> deleteLeaveById(int id);
        public  Task<int> InsertAssignLeaveAsync(int empId,string noOfLeave,string leaveType);
        Task<ApiResponse<List<showLeave>>> getAllAssignedLeaveById(int empId);
        Task<int> UploadAttendance(IFormFile file, int selectedMonth, int currentYear);
        Task<ApiResponse<List<Attendance>>> EmpAttendanceDataByEmpCode(string empCode, int month, int year);

        Task<ApiResponse<List<EmpWorkingDetails>>> EmpWorkingDetailsByempCode(int empCode, int month, int year);

        Task<bool> AddProject(project data);
        Task<ApiResponse<List<project>>> GetAllProject(string? SearchTerm, int? pageNumber, int? pageSize);
        Task<ApiResponse<List<project>>> GetAllProjectById(int id);
        Task<bool> deleteProjectById(int id);

        Task<ApiResponse<List<AssignLeaveDetails>>> getAllAssignedLeave(string? searchTerm, int? pageNumber, int? pageSize);

    }
}
