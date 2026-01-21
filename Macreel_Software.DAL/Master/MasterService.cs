using Macreel_Software.Contracts.DTOs;
using Macreel_Software.Models;
using Macreel_Software.Models.Master;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QuestPDF.Helpers;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
                    cmd.Parameters.AddWithValue("@id",data.id);
                    cmd.Parameters.AddWithValue("@action",data.id>0? "updateRole" : "insert");

              
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
        public async Task<ApiResponse<List<role>>> getAllRole(string? searchTerm,int? pageNumber,int? pageSize)
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

        #region technology

        public async Task<int> insertTechnology(technology data)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("sp_technology", _conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id",data.id);
                cmd.Parameters.AddWithValue("@SoftwareType", data.SoftwareType);
                cmd.Parameters.AddWithValue("@technology", data.technologyName);
                cmd.Parameters.AddWithValue("@action",data.id>0? "update" : "insert");

                SqlParameter sqlParameter = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(sqlParameter);
                if (_conn.State != ConnectionState.Open)
                    await _conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();
                return sqlParameter.Value != DBNull.Value
                   ? Convert.ToInt32(sqlParameter.Value)
                   : 0;


            }
            catch(Exception ex)
            {
                throw;
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }

        public async Task<ApiResponse<List<technology>>> getAllTechnology(
    string? searchTerm,
    int? pageNumber,
    int? pageSize)
        {
            List<technology> list = new();
            int totalRecords = 0;

            try
            {
                using SqlCommand cmd = new SqlCommand("sp_technology", _conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add("@action", SqlDbType.VarChar, 100).Value = "selectAllTechnology";
                cmd.Parameters.Add("@searchTerm", SqlDbType.VarChar, 250)
                   .Value = string.IsNullOrWhiteSpace(searchTerm) ? DBNull.Value : searchTerm;

                cmd.Parameters.Add("@pageNumber", SqlDbType.Int)
                   .Value = pageNumber.HasValue ? pageNumber.Value : DBNull.Value;

                cmd.Parameters.Add("@pageSize", SqlDbType.Int)
                   .Value = pageSize.HasValue ? pageSize.Value : DBNull.Value;

                if (_conn.State == ConnectionState.Closed)
                    await _conn.OpenAsync();

                using SqlDataReader sdr = await cmd.ExecuteReaderAsync();

                while (await sdr.ReadAsync())
                {
                    if (totalRecords == 0 && sdr["TotalRecords"] != DBNull.Value)
                        totalRecords = Convert.ToInt32(sdr["TotalRecords"]);

                    list.Add(new technology
                    {
                        id = Convert.ToInt32(sdr["id"]),
                        SoftwareType = sdr["SoftwareType"]?.ToString(),
                        technologyName = sdr["technology"]?.ToString()
                    });
                }

                return ApiResponse<List<technology>>.PagedResponse(
                    list,
                    pageNumber ?? 1,
                    pageSize ?? list.Count,
                    totalRecords,
                    "Technology list fetched successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<List<technology>>.FailureResponse(
                    ex.Message,
                    500,
                    "TECH_FETCH_ERROR"
                );
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }



        public async Task<ApiResponse<List<technology>>> getAllTechnologyById(int id)
        {
            List<technology> list = new List<technology>();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_technology", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "selectAllById");
                    cmd.Parameters.AddWithValue("@id", id);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            list.Add(new technology
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                SoftwareType = sdr["SoftwareType"] != DBNull.Value
                                                    ? sdr["SoftwareType"].ToString()
                                                    : "",
                                technologyName = sdr["technology"] != DBNull.Value
                                                    ? sdr["technology"].ToString()
                                                    : "",
                                
                            });
                        }
                    }
                }

                if (list.Any())
                {
                    return ApiResponse<List<technology>>.SuccessResponse(
                        list,
                        "technology data fetched successfully."
                    );
                }
                else
                {
                    return ApiResponse<List<technology>>.FailureResponse(
                        "No technology data found.",
                        404
                    );
                }
            }
            catch (Exception ex)
            {
                return ApiResponse<List<technology>>.FailureResponse(
                    "An error occurred while fetching technology.",
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

        public async Task<bool> deleteTechnologyById(int id)
        {
            try
            {
                using SqlCommand cmd = new SqlCommand("sp_technology", _conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@action", "deleteById");
                cmd.Parameters.AddWithValue("@id", id);

                SqlParameter resultParam = new SqlParameter("@result", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(resultParam);

                if (_conn.State == ConnectionState.Closed)
                    await _conn.OpenAsync();

                await cmd.ExecuteNonQueryAsync();

                return Convert.ToInt32(resultParam.Value) == 3;
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting technology", ex);
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }


        #endregion

        #region skills

        public async Task<ApiResponse<List<technologyDetails>>> EmpListForWebByTechId(int id)
        {
            List<technologyDetails> list = new List<technologyDetails>();
            try
            {
                SqlCommand cmd = new SqlCommand("sp_technology", _conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@action", "empListForWebByTechId");
                cmd.Parameters.AddWithValue("@id",id);
                if (_conn.State == ConnectionState.Closed)
                    await _conn.OpenAsync();

                using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                {
                    if (sdr.HasRows)
                    {
                        while(await sdr.ReadAsync())
                        {
                            list.Add(new technologyDetails
                            {
                                //id = Convert.ToInt32(sdr["skillId"]),
                                empId = sdr["empId"] != DBNull.Value ? Convert.ToInt32(sdr["empId"]):(int?)null,
                                technologyId = sdr["technolgyId"] != DBNull.Value ? Convert.ToInt32(sdr["technolgyId"]):null,
                                technologyName = sdr["technology"] != DBNull.Value ? sdr["technology"].ToString():null,
                                empName = sdr["empName"] != DBNull.Value ? sdr["empName"].ToString():null

                            });
                        }
                    }
                }
                if(list.Any())
                {
                    return ApiResponse<List<technologyDetails>>.SuccessResponse(list,"emp details for web fetched successfully!!");
                }
                else
                {
                    return ApiResponse<List<technologyDetails>>.FailureResponse("Failed to fetched emp list for web!!", 404);
                }
            }
            catch(Exception ex)
            {
                return ApiResponse<List<technologyDetails>>.FailureResponse("An error occured during fetched emp list for web!!", 500, errorCode: "exception", validationErrors: null);
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                { 
                await _conn.CloseAsync();
                }
            }
        }


        public async Task<ApiResponse<List<technologyDetails>>> empListForAppByTechId(int id)
        {
            List<technologyDetails> list = new List<technologyDetails>();
            try
            {
                SqlCommand cmd = new SqlCommand("sp_technology", _conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@action", "empListForAppByTechId");
                cmd.Parameters.AddWithValue("@id", id);

                if (_conn.State == ConnectionState.Closed)
                    await _conn.OpenAsync();

                using(SqlDataReader sdr=await cmd.ExecuteReaderAsync())
                {
                    if(sdr.HasRows)
                    {
                        while(await sdr.ReadAsync())
                        {
                            list.Add(new technologyDetails
                            {
                                //id = Convert.ToInt32(sdr["skillId"]),
                                empId = sdr["empId"] != DBNull.Value ? Convert.ToInt32(sdr["empId"]):null,
                                technologyId = sdr["technolgyId"] != DBNull.Value ? Convert.ToInt32(sdr["technolgyId"]):null,
                                technologyName = sdr["technology"] != DBNull.Value ? sdr["technology"].ToString():null,
                                empName = sdr["empName"] != DBNull.Value ? sdr["empName"].ToString():null
                            });
                        }
                    }
                }

                if(list.Any())
                {
                    return ApiResponse<List<technologyDetails>>.SuccessResponse(list, "Emp details fetched successfully for App type!!");
                }
                else
                {
                    return ApiResponse<List<technologyDetails>>.FailureResponse("Failed to fetched emp details for App type!!", 404);
                }
            }
            catch(Exception ex)
            {
                return ApiResponse<List<technologyDetails>>.FailureResponse("An error occured during fetched emp detail for App type!!", 500, errorCode: "exception", validationErrors: null);
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }



        #endregion

        #region  Add Pages & Assign Pages          
        public async Task<bool> InsertUpdatePage(Page data)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_managePages", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@id", data.id > 0 ? data.id : DBNull.Value);
                    cmd.Parameters.AddWithValue("@pageName", data.pageName);
                    cmd.Parameters.AddWithValue("@pageUrl", data.pageUrl);
                    cmd.Parameters.AddWithValue("@action", data.id > 0 ? "updatePage" : "insertPage");

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    return await cmd.ExecuteNonQueryAsync() > 0;
                }
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        public async Task<ApiResponse<List<Page>>> GetAllPages(int? id,int? pageNumber,int? pageSize)
        {
            List<Page> list = new();
            int totalRecords = 0;

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_managePages", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@action", "getPages");
                    cmd.Parameters.AddWithValue("@id", id.HasValue ? id.Value : DBNull.Value);

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

                            list.Add(new Page
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                pageName = sdr["pageName"].ToString(),
                                pageUrl = sdr["pageUrl"].ToString()
                            });
                        }
                    }
                }

                // Pagination response
                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    return ApiResponse<List<Page>>.PagedResponse(
                        list,
                        pageNumber.Value,
                        pageSize.Value,
                        totalRecords,
                        "Page list fetched successfully");
                }

                // Normal response
                var response = ApiResponse<List<Page>>.SuccessResponse(
                    list,
                    "Page list fetched successfully");

                response.TotalRecords = totalRecords;
                return response;
            }
            catch (Exception ex)
            {
                return ApiResponse<List<Page>>.FailureResponse(
                    ex.Message,
                    500,
                    "PAGE_FETCH_ERROR");
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        public async Task<bool> DeletePageById(int id)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_managePages", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "deletePage");
                    cmd.Parameters.AddWithValue("@id", id);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    return rowsAffected > 0;
                }
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }

        public async Task<ApiResponse<bool>> AssignOrUpdateRolePages(AssignPage data)
        {
            if (data.pages == null || !data.pages.Any())
            {
                return ApiResponse<bool>.FailureResponse(
                    "Pages are required",
                    400,
                    "VALIDATION_ERROR");
            }

            try
            {
                if (_conn.State != ConnectionState.Open)
                    await _conn.OpenAsync();

                using (SqlCommand cmd =
                       new SqlCommand("sp_managePages", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "assignOrUpdateRolePages");
                    cmd.Parameters.AddWithValue("@roleId", data.roleId);

                    // TVP
                    DataTable dt = new DataTable();
                    dt.Columns.Add("pageId", typeof(int));

                    foreach (var p in data.pages)
                        dt.Rows.Add(p.pageId);

                    SqlParameter tvpParam = cmd.Parameters.AddWithValue("@pageIds", dt);
                    tvpParam.SqlDbType = SqlDbType.Structured;
                    tvpParam.TypeName = "PageIdTableType";

                    await cmd.ExecuteNonQueryAsync();
                }

                return ApiResponse<bool>.SuccessResponse(
                    true,
                    "Role pages updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.FailureResponse(
                    ex.Message,
                    500,
                    "ROLE_PAGE_UPDATE_ERROR");
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        public async Task<ApiResponse<List<RolePagesDto>>> GetAllAssignedPages(int? id = null,int? pageNumber = null,int? pageSize = null)
        {
            List<RolePagesDto> result = new();
            Dictionary<int, RolePagesDto> roleDict = new();

            int totalRecords = 0;

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_managePages", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@action", "getAssignPages");
                    cmd.Parameters.AddWithValue("@id", id.HasValue ? id.Value : DBNull.Value);

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

                            int roleId = Convert.ToInt32(sdr["roleId"]);

                            // Agar role pehle se nahi hai
                            if (!roleDict.ContainsKey(roleId))
                            {
                                roleDict[roleId] = new RolePagesDto
                                {
                                    roleId = roleId,
                                    roleName = sdr["roleName"].ToString()
                                };
                            }

                            // Page add karo
                            roleDict[roleId].pages.Add(new PageDto
                            {
                                pageId = Convert.ToInt32(sdr["pageId"]),
                                pageName = sdr["pageName"].ToString(),
                                pageUrl = sdr["pageUrl"].ToString()
                            });
                        }
                    }
                }

                result = roleDict.Values.ToList();

                // Pagination response
                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    return ApiResponse<List<RolePagesDto>>.PagedResponse(
                        result,
                        pageNumber.Value,
                        pageSize.Value,
                        totalRecords,
                        "Role wise pages fetched successfully");
                }

                var response = ApiResponse<List<RolePagesDto>>.SuccessResponse(
                    result,
                    "Role wise pages fetched successfully");

                response.TotalRecords = totalRecords;
                return response;
            }
            catch (Exception ex)
            {
                return ApiResponse<List<RolePagesDto>>.FailureResponse(
                    ex.Message,
                    500,
                    "ROLE_PAGE_FETCH_ERROR");
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        #endregion
    }
}
