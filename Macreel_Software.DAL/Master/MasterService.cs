using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Macreel_Software.Models;
using Macreel_Software.Models.Master;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Macreel_Software.DAL.Master
{
    public class MasterService:IMasterService
    {
        private readonly SqlConnection _conn;

        public MasterService(IConfiguration config)
        {
            _conn = new SqlConnection(
                config.GetConnectionString("DefaultConnection"));
        }

        #region role service
        public async Task<int> InsertRole(role data)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_role", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                  
                    cmd.Parameters.AddWithValue("@rolename", data.rolename);
                    cmd.Parameters.AddWithValue("@action", "insert");

              
                    SqlParameter resultParam = new SqlParameter("@result", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(resultParam);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    await cmd.ExecuteNonQueryAsync();

                    return Convert.ToInt32(resultParam.Value);
                }
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }



        public async Task<ApiResponse<List<role>>> getAllRole(
          string? searchTerm,
          int? pageNumber,
          int? pageSize)
        {
            List<role> list = new();
            int totalRecords = 0;

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_role", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getAllRole");

                    cmd.Parameters.AddWithValue("@searchTerm",
                        string.IsNullOrWhiteSpace(searchTerm) ? DBNull.Value : searchTerm);

                    cmd.Parameters.AddWithValue("@pageNumber",
                        pageNumber.HasValue ? pageNumber.Value : DBNull.Value);

                    cmd.Parameters.AddWithValue("@pageSize",
                        pageSize.HasValue ? pageSize.Value : DBNull.Value);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            
                            if (totalRecords == 0)
                                totalRecords = Convert.ToInt32(sdr["TotalRecords"]);

                            list.Add(new role
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                rolename = sdr["roleName"].ToString()
                            });
                        }
                    }
                }

            
                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    return ApiResponse<List<role>>.PagedResponse(
                        list,
                        pageNumber.Value,
                        pageSize.Value,
                        totalRecords,
                        "Role list fetched successfully");
                }

             
                var response = ApiResponse<List<role>>.SuccessResponse(
                    list,
                    "Role list fetched successfully");

                response.TotalRecords = totalRecords; 

                return response;
            }
            catch (Exception ex)
            {
                return ApiResponse<List<role>>.FailureResponse(
                    ex.Message,
                    500,
                    "ROLE_FETCH_ERROR");
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }


        public async Task<ApiResponse<List<role>>> getAllRoleById(int id)
        {
            List<role> list = new();

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_role", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getRoleById");
                    cmd.Parameters.AddWithValue("@id", id);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            list.Add(new role
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                rolename = sdr["roleName"] != DBNull.Value
                                    ? sdr["roleName"].ToString()
                                    : null
                            });
                        }
                    }
                }

                if (!list.Any())
                {
                    return ApiResponse<List<role>>.FailureResponse(
                        "Role not found",
                        404,
                        "ROLE_NOT_FOUND"
                    );
                }


                return ApiResponse<List<role>>.SuccessResponse(
                    list,
                    "Role fetched successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<List<role>>.FailureResponse(
                    ex.Message,
                    500,
                    "ROLE_FETCH_ERROR"
                );
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }


        public async Task<bool> deleteRoleById(int id)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_role", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "deleteRole");
                    cmd.Parameters.AddWithValue("@id", id);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    _conn.CloseAsync();
            }
        }


        #endregion

        #region department service


        public async Task<int> insertDepartment(department data)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_department", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = data.id;
                    cmd.Parameters.Add("@departmentName", SqlDbType.VarChar, 150)
                                  .Value = data.departmentName ?? "";

                    cmd.Parameters.Add("@action", SqlDbType.VarChar, 30)
                                  .Value = data.id > 0 ? "updatedDepartment" : "insert";

                    SqlParameter resultParam = new SqlParameter("@result", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(resultParam);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    await cmd.ExecuteNonQueryAsync();

                    return resultParam.Value != DBNull.Value
                        ? Convert.ToInt32(resultParam.Value)
                        : 0;
                }
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
        }


        public async Task<ApiResponse<List<department>>> getAllDepartment(
        string? searchTerm,
        int? pageNumber,
        int? pageSize)
        {
            List<department> list = new();
            int totalRecords = 0;

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_department", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getAllDepartment");

                    cmd.Parameters.AddWithValue("@searchTerm",
                        string.IsNullOrWhiteSpace(searchTerm) ? DBNull.Value : searchTerm);

                    cmd.Parameters.AddWithValue("@pageNumber",
                        pageNumber.HasValue ? pageNumber.Value : DBNull.Value);

                    cmd.Parameters.AddWithValue("@pageSize",
                        pageSize.HasValue ? pageSize.Value : DBNull.Value);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                         
                            if (totalRecords == 0 && sdr["TotalRecords"] != DBNull.Value)
                                totalRecords = Convert.ToInt32(sdr["TotalRecords"]);

                            list.Add(new department
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                departmentName = sdr["departmentName"]?.ToString()
                            });
                        }
                    }
                }

              
                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    return ApiResponse<List<department>>.PagedResponse(
                        list,
                        pageNumber.Value,
                        pageSize.Value,
                        totalRecords,
                        "Department list fetched successfully"
                    );
                }

               
                var response = ApiResponse<List<department>>.SuccessResponse(
                    list,
                    "Department list fetched successfully"
                );
                response.TotalRecords = totalRecords;

                return response;
            }
            catch (Exception ex)
            {
                return ApiResponse<List<department>>.FailureResponse(
                    ex.Message,
                    500,
                    "DEPT_FETCH_ERROR"
                );
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }


        public async Task<ApiResponse<List<department>>> getAllDepartmentById(int id)
        {
            List<department> list = new List<department>();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_department", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getDepartmentById");
                    cmd.Parameters.AddWithValue("@id", id);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            list.Add(new department
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                departmentName = sdr["departmentName"] != DBNull.Value
                                                    ? sdr["departmentName"].ToString()
                                                    : ""
                            });
                        }
                    }
                }

                if (list.Any())
                {
                    return ApiResponse<List<department>>.SuccessResponse(
                        list,
                        "Department data fetched successfully."
                    );
                }
                else
                {
                    return ApiResponse<List<department>>.FailureResponse(
                        "No department data found.",
                        404
                    );
                }
            }
            catch (Exception ex)
            {
                return ApiResponse<List<department>>.FailureResponse(
                    "An error occurred while fetching Department.",
                    500,
                    errorCode: "EXCEPTION",
                    validationErrors: null
                );
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }


        public async Task<bool> deleteDepartmentById(int id)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_department", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "deleteDepartmentById");
                    cmd.Parameters.AddWithValue("@id", id);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
            catch (Exception ex)
            {

                throw new Exception("Error deleting department", ex);
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    _conn.CloseAsync();
            }
        }
        #endregion

        #region designation
        public async Task<int> InsertDesignation(designation data)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_designation", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add("@id", SqlDbType.Int).Value = data.id;
                    cmd.Parameters.Add("@designationName", SqlDbType.VarChar, 150)
                                  .Value = data.designationName ?? "";

                    cmd.Parameters.Add("@action", SqlDbType.VarChar, 30)
                                  .Value = data.id > 0 ? "updateDesignation" : "insert";

                    SqlParameter resultParam = new SqlParameter("@result", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(resultParam);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    await cmd.ExecuteNonQueryAsync();

                    return resultParam.Value != DBNull.Value
                        ? Convert.ToInt32(resultParam.Value)
                        : 0;
                }
            }
            finally
            {
                if (_conn.State != ConnectionState.Closed)
                    await _conn.CloseAsync();
            }
        }


        public async Task<ApiResponse<List<designation>>> getAllDesignation(
          string? searchTerm,
          int? pageNumber,
          int? pageSize)
        {
            List<designation> list = new();
            int totalRecords = 0;

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_designation", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getAllDesignation");
                    cmd.Parameters.AddWithValue("@searchTerm", string.IsNullOrWhiteSpace(searchTerm) ? DBNull.Value : searchTerm);
                    cmd.Parameters.AddWithValue("@pageNumber", pageNumber.HasValue ? pageNumber.Value : DBNull.Value);
                    cmd.Parameters.AddWithValue("@pageSize", pageSize.HasValue ? pageSize.Value : DBNull.Value);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            if (totalRecords == 0 && sdr["TotalRecords"] != DBNull.Value)
                                totalRecords = Convert.ToInt32(sdr["TotalRecords"]);

                            list.Add(new designation
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                designationName = sdr["designationName"]?.ToString()
                            });
                        }
                    }
                }

                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    return ApiResponse<List<designation>>.PagedResponse(
                        list,
                        pageNumber.Value,
                        pageSize.Value,
                        totalRecords,
                        "Designation list fetched successfully"
                    );
                }

                var response = ApiResponse<List<designation>>.SuccessResponse(
                    list,
                    "Designation list fetched successfully"
                );
                response.TotalRecords = totalRecords;
                return response;
            }
            catch (Exception ex)
            {
                return ApiResponse<List<designation>>.FailureResponse(
                    ex.Message,
                    500,
                    "DESIG_FETCH_ERROR"
                );
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }


        public async Task<ApiResponse<List<designation>>> getAllDesignationById(int id)
        {
            List<designation> list = new List<designation>();

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_designation", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getDesignationById");
                    cmd.Parameters.AddWithValue("@id", id);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            list.Add(new designation
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                designationName = sdr["designationName"] != DBNull.Value
                                    ? sdr["designationName"].ToString()
                                    : ""
                            });
                        }
                    }
                }

                if (list.Any())
                {
                    return ApiResponse<List<designation>>.SuccessResponse(
                        list,
                        "Designation data fetched successfully"
                    );
                }
                else
                {
                    return ApiResponse<List<designation>>.FailureResponse(
                        "No designation found",
                        404,
                        "DESIGNATION_NOT_FOUND"
                    );
                }
            }
            catch (Exception ex)
            {
                return ApiResponse<List<designation>>.FailureResponse(
                    "An error occurred while fetching designation",
                    500,
                    "SERVER_ERROR"
                );
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }


        public async Task<bool> deleteDesignationById(int id)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_designation", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "deleteById");
                    cmd.Parameters.AddWithValue("@id", id);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
            catch (Exception ex)
            {

                throw new Exception("Error deleting designation", ex);
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    _conn.CloseAsync();
            }
        }
        #endregion
    }
}
