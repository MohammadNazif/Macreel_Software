using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macreel_Software.Models;
using Macreel_Software.Models.Master;

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
    }
}
