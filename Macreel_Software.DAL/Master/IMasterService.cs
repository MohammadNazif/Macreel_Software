using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macreel_Software.Models;
using Macreel_Software.Models.Master;

namespace Macreel_Software.DAL.Master
{
    public interface IMasterService
    {
        Task<int> InsertRole(role data);
        Task<ApiResponse<List<role>>> getAllRole(string? searchTerm, int? pageNumber, int? pageSize);
        Task<ApiResponse<List<role>>> getAllRoleById(int id);

        Task<bool> deleteRoleById(int id);
        Task<int> insertDepartment(department data);
        Task<ApiResponse<List<department>>> getAllDepartment(string? searchTerm,int? pageNumber,int? pageSize);

        Task<ApiResponse<List<department>>> getAllDepartmentById(int id);
        Task<bool> deleteDepartmentById(int id);

        Task<int> InsertDesignation(designation data);

        Task<ApiResponse<List<designation>>> getAllDesignation(string? searchTerm, int? pageNumber, int? pageSize);


        Task<ApiResponse<List<designation>>> getAllDesignationById(int id);

        Task<bool> deleteDesignationById(int id);


    }
}
