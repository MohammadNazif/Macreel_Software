using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macreel_Software.Models;
using Macreel_Software.Models.Employee;

namespace Macreel_Software.DAL.Employee
{
    public interface IEmployeeService
    {
        Task<bool> insertResponseByEmpId(EmployeeData data);
        Task<ApiResponse<List<assignedLeave>>> AssignedLeaveListByEmpId( int empId, string? searchTerm, int? pageNumber,
         int? pageSize);
        Task<bool> insertApplyLeaveByEmpId(applyLeave data);
    }
}
