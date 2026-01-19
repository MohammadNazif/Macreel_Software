using System.Data;
using Macreel_Software.Models;
using Macreel_Software.Contracts.DTOs;
using Macreel_Software.Models.Employee;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Macreel_Software.DAL.Employee
{
    public class EmployeeServices:IEmployeeService
    {
        private readonly IConfiguration _config;
        private readonly SqlConnection _conn;

        public EmployeeServices(IConfiguration config)
        {
            _config = config;
            string connectionString = _config.GetConnectionString("DefaultConnection");
            _conn = new SqlConnection(connectionString);
        }

        public async Task<bool> insertResponseByEmpId(EmployeeData data)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("sp_ruleBookResponse", _conn);
                cmd.CommandType =CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@action", "getUserResponseByEmpId");
                cmd.Parameters.AddWithValue("@empId", data.empId);
                cmd.Parameters.AddWithValue("@ruleBookId", data.ruleBookId);
                cmd.Parameters.AddWithValue("@response", data.response);
                if(_conn.State==ConnectionState.Closed)
                    await _conn.OpenAsync();

                int rows=await cmd.ExecuteNonQueryAsync();
                return rows > 0;
            }
            catch(Exception ex)
            {
                throw;
            }
            finally
            {
                if(_conn.State==ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        
        }

        public async Task<ApiResponse<List<assignedLeave>>> AssignedLeaveListByEmpId(int empId,string? searchTerm,
        int? pageNumber,int? pageSize)
        {
            List<assignedLeave> list = new();
            int totalRecords = 0;

            try
            {
                using SqlCommand cmd = new SqlCommand("sp_assignLeave", _conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@action", "getAssignedLeaveListByEmpId");
                cmd.Parameters.AddWithValue("@empId", empId);
                cmd.Parameters.AddWithValue(
                    "@searchTerm",
                    string.IsNullOrWhiteSpace(searchTerm) ? (object)DBNull.Value : searchTerm
                );
                cmd.Parameters.AddWithValue(
                    "@pageNumber",
                    pageNumber.HasValue ? (object)pageNumber.Value : DBNull.Value
                );
                cmd.Parameters.AddWithValue(
                    "@pageSize",
                    pageSize.HasValue ? (object)pageSize.Value : DBNull.Value
                );

                if (_conn.State == ConnectionState.Closed)
                    await _conn.OpenAsync();

                using SqlDataReader sdr = await cmd.ExecuteReaderAsync();

                while (await sdr.ReadAsync())
                {
                    if (totalRecords == 0 && sdr["TotalRecords"] != DBNull.Value)
                        totalRecords = Convert.ToInt32(sdr["TotalRecords"]);

                    list.Add(new assignedLeave
                    {
                        id = Convert.ToInt32(sdr["id"]),
                        empId = sdr["empId"] as int?,
                        leaveId = sdr["leaveType"] as int?, // ✔ column name match
                        noOfLeave = sdr["noOfLeave"] as int?,
                        leaveName = sdr["leaveName"]?.ToString(),
                        description = sdr["description"]?.ToString()
                    });
                }

                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    return ApiResponse<List<assignedLeave>>.PagedResponse(
                        list,
                        pageNumber.Value,
                        pageSize.Value,
                        totalRecords,
                        list.Any()
                            ? "Assigned leave list fetched successfully"
                            : "No assigned leave found");
                }

                var response = ApiResponse<List<assignedLeave>>.SuccessResponse(
                    list,
                    list.Any()
                        ? "Assigned leave list fetched successfully"
                        : "No assigned leave found");

                response.TotalRecords = totalRecords;

                return response;
            }
            catch (Exception ex)
            {
                return ApiResponse<List<assignedLeave>>.FailureResponse(
                    ex.Message,
                    500,
                    "ASSIGNED_LEAVE_FETCH_ERROR");
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }

        #region apply leave
        public async Task<ApiResponse<List<AssignedLeaveDto>>> GetAllAssignedLeaveByEmpCode(int empcode)
        {
            List<AssignedLeaveDto> list = new();

            try
            {
                using SqlCommand cmd = new SqlCommand("sp_leave", _conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@action", "getAllAssignedLeaves");
                cmd.Parameters.AddWithValue("@empcode", empcode);

                if (_conn.State == ConnectionState.Closed)
                    await _conn.OpenAsync();

                using SqlDataReader sdr = await cmd.ExecuteReaderAsync();

                while (await sdr.ReadAsync())
                {
                    list.Add(new AssignedLeaveDto
                    {
                        LeaveType = sdr["leaveType"].ToString(),
                        AssignedLeave = Convert.ToInt32(sdr["assignedLeave"]),
                        UsedLeave = Convert.ToInt32(sdr["usedLeave"]),
                        RemainingLeave = Convert.ToInt32(sdr["remainingLeave"])
                    });
                }

                return ApiResponse<List<AssignedLeaveDto>>.SuccessResponse(
                    list,
                    "Leave balance fetched successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<List<AssignedLeaveDto>>.FailureResponse(
                    ex.Message,
                    500,
                    "LEAVE_BALANCE_ERROR"
                );
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }

        public async Task<bool> insertApplyLeaveByEmpId(applyLeave data)
        {
            try
            {
                if (!data.fromDate.HasValue || !data.toDate.HasValue)
                    throw new Exception("From date and To date are required.");

                DateTime fromDate = data.fromDate.Value.Date;
                DateTime toDate = data.toDate.Value.Date;

                int leaveCount = (toDate - fromDate).Days + 1;

                if (leaveCount <= 0)
                    throw new Exception("Invalid leave date range.");

                using (SqlCommand cmd = new SqlCommand("sp_applyLeave", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@id", data.id);
                    cmd.Parameters.AddWithValue("@empId", data.empId);
                    cmd.Parameters.AddWithValue("@fromDate", fromDate);
                    cmd.Parameters.AddWithValue("@toDate", toDate);
                    cmd.Parameters.AddWithValue("@leaveType", data.leaveTypeId);
                    cmd.Parameters.AddWithValue("@description", data.description);
                    cmd.Parameters.AddWithValue("@leaveCount", leaveCount);
                    cmd.Parameters.AddWithValue("@filename", data.fileName);
                    cmd.Parameters.AddWithValue("@action", "insertLeave");

                    if (_conn.State == ConnectionState.Closed)
                        await _conn.OpenAsync();

                    await cmd.ExecuteNonQueryAsync();
                    return true;
                }
            }
            catch (SqlException ex)
            {
                throw new Exception(ex.Message);
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }

        public async Task<ApiResponse<List<applyLeave>>> applyLeaveListByEmpId(int empId, string? searchTerm,
     int? pageNumber, int? pageSize)
        {
            List<applyLeave> list = new();
            int totalRecords = 0;

            try
            {
                using SqlCommand cmd = new SqlCommand("sp_applyLeave", _conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@action", "getAllAppliedLeave");

                cmd.Parameters.AddWithValue("@empId", empId);

                cmd.Parameters.AddWithValue(
                    "@searchTerm",
                    string.IsNullOrWhiteSpace(searchTerm) ? (object)DBNull.Value : searchTerm
                );

                cmd.Parameters.AddWithValue(
                    "@pageNumber",
                    pageNumber.HasValue ? (object)pageNumber.Value : DBNull.Value
                );

                cmd.Parameters.AddWithValue(
                    "@pageSize",
                    pageSize.HasValue ? (object)pageSize.Value : DBNull.Value
                );


                if (_conn.State == ConnectionState.Closed)
                    await _conn.OpenAsync();

                using SqlDataReader sdr = await cmd.ExecuteReaderAsync();

                while (await sdr.ReadAsync())
                {
                    if (totalRecords == 0 && sdr["TotalRecords"] != DBNull.Value)
                        totalRecords = Convert.ToInt32(sdr["TotalRecords"]);

                    list.Add(new applyLeave
                    {
                        id = Convert.ToInt32(sdr["id"]),
                        empId = sdr["empId"] as int?,
                        leaveTypeId= sdr["leaveType"] as int?,
                        fromDate = sdr["fromDate"] != DBNull.Value ? Convert.ToDateTime(sdr["fromDate"]):null,
                        toDate = sdr["toDate"] != DBNull.Value ? Convert.ToDateTime(sdr["toDate"]):null, 
                        leaveCount = sdr["leaveCount"] as int?,
                        leaveName = sdr["leaveName"]?.ToString(),
                        description = sdr["description"]?.ToString(),
                        applieddate = sdr["appliedDate"] != DBNull.Value ? Convert.ToDateTime(sdr["appliedDate"]):null,
                        status = Convert.ToInt32(sdr["adminStatus"]) == 0?"Pending": Convert.ToInt32(sdr["adminStatus"]) ==1?"Approved": Convert.ToInt32(sdr["adminStatus"]) == 2 ?"Unapproved":""
                    });
                }

                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    return ApiResponse<List<applyLeave>>.PagedResponse(
                        list,
                        pageNumber.Value,
                        pageSize.Value,
                        totalRecords,
                        list.Any()
                            ? "Assigned leave list fetched successfully"
                            : "No assigned leave found");
                }

                var response = ApiResponse<List<applyLeave>>.SuccessResponse(
                    list,
                    list.Any()
                        ? "Assigned leave list fetched successfully"
                        : "No assigned leave found");

                response.TotalRecords = totalRecords;

                return response;
            }
            catch (Exception ex)
            {
                return ApiResponse<List<applyLeave>>.FailureResponse(
                    ex.Message,
                    500,
                    "ASSIGNED_LEAVE_FETCH_ERROR");
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }

        public async Task<ApiResponse<List<applyLeave>>> getAllApplyLeaveById(int id , int empId)
        {
            List<applyLeave> list = new();

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_applyLeave", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getAppliedLeaveById");
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@empId", empId);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            list.Add(new applyLeave
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                empId = sdr["empId"] as int?,
                                leaveTypeId = sdr["leaveType"] as int?,
                                fromDate = sdr["fromDate"] != DBNull.Value ? Convert.ToDateTime(sdr["fromDate"]) : null,
                                toDate = sdr["toDate"] != DBNull.Value ? Convert.ToDateTime(sdr["toDate"]) : null,
                                leaveCount = sdr["leaveCount"] as int?,
                                leaveName = sdr["leaveName"]?.ToString(),
                                description = sdr["description"]?.ToString(),
                                applieddate = sdr["appliedDate"] != DBNull.Value ? Convert.ToDateTime(sdr["appliedDate"]) : null,
                            });
                        }
                    }
                }

                if (!list.Any())
                {
                    return ApiResponse<List<applyLeave>>.FailureResponse(
                        "Apply leave not found",
                        404,
                        "APPLY_LEAVE_FOUND"
                    );
                }


                return ApiResponse<List<applyLeave>>.SuccessResponse(
                    list,
                    "Apply leave fetched successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<List<applyLeave>>.FailureResponse(
                    ex.Message,
                    500,
                    "APPLY_LEAVE_ERROR"
                );
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }

        public async Task<bool> deleteApplyLeaveById(int id,int empId)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_applyLeave", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "deleteAppliedLeaveByid");
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@empId", empId);

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

        #region dashboard
        public async Task<ApiResponse<Dashboard>> DashboardCount(int empId)
        {
            try
            {
                Dashboard dashboard = new();

                using SqlCommand cmd = new SqlCommand("sp_empDashboard", _conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@action", "EmpDashCount");
                cmd.Parameters.AddWithValue("@empId", empId);

                if (_conn.State == ConnectionState.Closed)
                    await _conn.OpenAsync();

                using SqlDataReader sdr = await cmd.ExecuteReaderAsync();

                if (await sdr.ReadAsync())
                {
                    dashboard.TotalProjects = Convert.ToInt32(sdr["TotalProjects"]);
                    dashboard.OngoingProjects = Convert.ToInt32(sdr["OngoingProjects"]);
                    dashboard.AssignedLeave = Convert.ToInt32(sdr["AssignedLeave"]);
                    dashboard.RequestedLeave = Convert.ToInt32(sdr["RequestedLeave"]);
                    dashboard.TotalTasks = Convert.ToInt32(sdr["TotalTasks"]);
                    dashboard.CompletedTasks = Convert.ToInt32(sdr["CompletedTasks"]);
                }

                return ApiResponse<Dashboard>.SuccessResponse(
                    dashboard,
                    "Dashboard count fetched successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<Dashboard>.FailureResponse(
                    ex.Message,
                    500,
                    "DASHBOARD_COUNT_FETCH_ERROR"
                );
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
