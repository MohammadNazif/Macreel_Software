using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography.Pkcs;
using System.Text;
using System.Threading.Tasks;
using FirebaseAdmin.Messaging;
using Macreel_Software.Models;
using Macreel_Software.Models.Master;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using static System.Collections.Specialized.BitVector32;

namespace Macreel_Software.DAL.Admin
{
    public  class AdminServices:IAdminServices
    {

        private readonly SqlConnection _conn;

        public AdminServices(IConfiguration config)
        {
            _conn = new SqlConnection(
                config.GetConnectionString("DefaultConnection"));
        }

        #region employee registration
        public async Task<string> InsertEmployeeRegistrationData(employeeRegistration data)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_Employee", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "insert");

                    cmd.Parameters.AddWithValue("@empRole", data.EmpRoleId);
                    cmd.Parameters.AddWithValue("@empCode", data.EmpCode);
                    cmd.Parameters.AddWithValue("@empName", data.EmpName);
                    cmd.Parameters.AddWithValue("@mobile", data.Mobile);
                    cmd.Parameters.AddWithValue("@department", data.DepartmentId);
                    cmd.Parameters.AddWithValue("@designation", data.DesignationId);

                    cmd.Parameters.AddWithValue("@profilePic", data.ProfilePicPath ?? "");
                    cmd.Parameters.AddWithValue("@aadharImg", data.AadharImgPath ?? "");
                    cmd.Parameters.AddWithValue("@panImg", data.PanImgPath ?? "");

                    cmd.Parameters.AddWithValue("@emailId", data.EmailId);
                    cmd.Parameters.AddWithValue("@dateOfJoining", data.DateOfJoining);
                    cmd.Parameters.AddWithValue("@salary", data.Salary);
                    cmd.Parameters.AddWithValue("@password", data.Password);

                    cmd.Parameters.AddWithValue("@bankName", data.BankName);
                    cmd.Parameters.AddWithValue("@accountNo", data.AccountNo);
                    cmd.Parameters.AddWithValue("@ifscCode", data.IfscCode);
                    cmd.Parameters.AddWithValue("@bankBranch", data.BankBranch);

                    cmd.Parameters.AddWithValue("@dob", data.Dob);
                    cmd.Parameters.AddWithValue("@gender", data.Gender);
                    cmd.Parameters.AddWithValue("@nationality", data.Nationality);
                    cmd.Parameters.AddWithValue("@maritalStatus", data.MaritalStatus);

                    cmd.Parameters.AddWithValue("@presentAddress", data.PresentAddress);
                    cmd.Parameters.AddWithValue("@state", data.StateId);
                    cmd.Parameters.AddWithValue("@city", data.CityId);
                    cmd.Parameters.AddWithValue("@pincode", data.Pincode);

                    cmd.Parameters.AddWithValue("@emergencyContactPersonName", data.EmergencyContactPersonName);
                    cmd.Parameters.AddWithValue("@emergenctContactNum", data.EmergencyContactNum);

                    cmd.Parameters.AddWithValue("@companyName", data.CompanyName ?? "");
                    cmd.Parameters.AddWithValue("@yearOfExperience", data.YearOfExperience);
                    cmd.Parameters.AddWithValue("@technology", data.Technology ?? "");
                    cmd.Parameters.AddWithValue("@companyContactno", data.CompanyContactNo ?? "");

                    cmd.Parameters.AddWithValue("@experienceCertificate", data.ExperienceCertificatePath ?? "");
                    cmd.Parameters.AddWithValue("@tenthCertificate", data.TenthCertificatePath ?? "");
                    cmd.Parameters.AddWithValue("@twelthCertificate", data.TwelthCertificatePath ?? "");
                    cmd.Parameters.AddWithValue("@graduationCertificate", data.GraduationCertificatePath ?? "");
                    cmd.Parameters.AddWithValue("@mastersCertificate", data.MastersCertificatePath ?? "");

                    cmd.Parameters.AddWithValue("@addedBy", data.addedBy);
                    cmd.Parameters.AddWithValue("@reportingManager",
                        (object?)data.ReportingManagerId ?? DBNull.Value);

                    //cmd.Parameters.AddWithValue("@status", 1);

                    if (_conn.State == ConnectionState.Closed)
                        await _conn.OpenAsync();

                    using (SqlDataReader dr = await cmd.ExecuteReaderAsync())
                    {
                        if (await dr.ReadAsync())
                        {
                            return dr["message"].ToString(); 
                        }
                    }
                }

                return "Employee registration failed";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    _conn.Close();
            }
        }

        public async Task<List<ReportingManger>> GetAllReportingManager()
        {
            List<ReportingManger> list = new();

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_employee", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action" ,"getReportingManager");

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            list.Add(new ReportingManger
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                ReportingManagerName = sdr["empName"]?.ToString()
                            });
                        }
                    }
                }
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }

            return list;
        }


        public async Task<ApiResponse<List<employeeRegistration>>> GetAllEmpData(
       string? searchTerm,
       int? pageNumber,
       int? pageSize)
        {
            List<employeeRegistration> list = new List<employeeRegistration>();
            int totalRecords = 0;

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_employee", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getAllEmployeeDetails");

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

                            list.Add(new employeeRegistration
                            {
                                Id = Convert.ToInt32(sdr["id"]),
                                EmpCode = sdr["empCode"] != DBNull.Value ? Convert.ToInt32(sdr["empCode"]) : (int?)null,
                                EmpRoleId = sdr["empRole"] != DBNull.Value ? Convert.ToInt32(sdr["empRole"]) : (int?)null,
                                roleName = sdr["roleName"]?.ToString(),
                                EmpName = sdr["empName"]?.ToString(),
                                Mobile = sdr["mobile"]?.ToString(),
                                DepartmentId = sdr["department"] != DBNull.Value ? Convert.ToInt32(sdr["department"]) : (int?)null,
                                departmentName = sdr["departmentName"]?.ToString(),
                                DesignationId = sdr["designation"] != DBNull.Value ? Convert.ToInt32(sdr["designation"]) : (int?)null,
                                designationName = sdr["designationName"]?.ToString(),
                                ReportingManagerId = sdr["reportingManager"] != DBNull.Value ? Convert.ToInt32(sdr["reportingManager"]) : (int?)null,
                                AadharImgPath = sdr["aadharImg"]?.ToString(),
                                PanImgPath = sdr["panImg"]?.ToString(),
                                EmailId = sdr["emailId"]?.ToString(),
                                DateOfJoining = sdr["dateOfJoining"] != DBNull.Value ? Convert.ToDateTime(sdr["dateOfJoining"]) : DateTime.MinValue,
                                Salary = sdr["salary"] != DBNull.Value ? Convert.ToInt32(sdr["salary"]) : (int?)null,
                                ProfilePicPath = sdr["profilePic"]?.ToString(),
                                BankName = sdr["bankName"]?.ToString(),
                                AccountNo = sdr["accountNo"]?.ToString(),
                                IfscCode = sdr["ifscCode"]?.ToString(),
                                BankBranch = sdr["bankBranch"]?.ToString(),
                                Dob = sdr["dob"] != DBNull.Value ? Convert.ToDateTime(sdr["dob"]) :DateTime.MinValue,
                                Gender = sdr["gender"]?.ToString(),
                                Nationality = sdr["nationality"]?.ToString(),
                                MaritalStatus = sdr["maritalStatus"]?.ToString(),
                                PresentAddress = sdr["presentAddress"]?.ToString(),
                                StateId = sdr["state"] != DBNull.Value ? Convert.ToInt32(sdr["state"]) : (int?)null,
                                CityId = sdr["city"] != DBNull.Value ? Convert.ToInt32(sdr["city"]) : (int?)null,
                                Pincode = sdr["pincode"]?.ToString(),
                                EmergencyContactPersonName = sdr["emergencyContactPersonName"]?.ToString(),
                                EmergencyContactNum = sdr["emergenctContactNum"]?.ToString(),
                                CompanyName = sdr["city"] != DBNull.Value ? sdr["companyName"]?.ToString():null,
                                Technology = sdr["technology"] != DBNull.Value ? sdr["technology"]?.ToString():null,
                                CompanyContactNo = sdr["companyContactNo"] != DBNull.Value ? sdr["companyContactNo"]?.ToString():null,
                                ExperienceCertificatePath = sdr["experienceCertificate"] != DBNull.Value ? sdr["experienceCertificate"]?.ToString():null,
                                TenthCertificatePath = sdr["tenthCertificate"] != DBNull.Value ? sdr["tenthCertificate"]?.ToString():null,
                                TwelthCertificatePath = sdr["twelthCertificate"] != DBNull.Value ? 
                                sdr["twelthCertificate"]?.ToString():null,

                                GraduationCertificatePath = sdr["graduationCertificate"] != DBNull.Value ? 
                                sdr["graduationCertificate"]?.ToString():null,

                                MastersCertificatePath = sdr["mastersCertificate"] != DBNull.Value ? sdr["mastersCertificate"]?.ToString():null,
                                YearOfExperience= sdr["yearOfExperience"] != DBNull.Value ? Convert.ToInt32(sdr["yearOfExperience"]) : (int?)null,
                                stateName = sdr["stateName"] != DBNull.Value ? sdr["stateName"].ToString():null,
                                cityName = sdr["cityName"] != DBNull.Value ? sdr["cityName"].ToString():null
                            });
                        }
                    }
                }

                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    return ApiResponse<List<employeeRegistration>>.PagedResponse(
                        list,
                        pageNumber.Value,
                        pageSize.Value,
                        totalRecords,
                        "Employee data list fetched successfully");
                }

                var response = ApiResponse<List<employeeRegistration>>.SuccessResponse(
                    list,
                    "Employee data list fetched successfully");

                response.TotalRecords = totalRecords;

                return response;
            }
            catch (Exception ex)
            {
                return ApiResponse<List<employeeRegistration>>.FailureResponse(
                    "Failed to fetch employee data",
                    500,
                    "EMP_FETCH_ERROR");
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }
        public async Task<bool> deleteEmployeeById(int id)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_employee", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "deleteEmployeeById");
                    cmd.Parameters.AddWithValue("@id", id);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    int rowsAffected = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                    return rowsAffected > 0;
                }
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }



        public async Task<ApiResponse<List<employeeRegistration>>> GetAllEmpDataById(int id)
        {
            List<employeeRegistration> list = new List<employeeRegistration>();
            int totalRecords = 0;

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_employee", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getEmployeeById");
                    cmd.Parameters.AddWithValue("@id", id);

                   

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            if (totalRecords == 0 && sdr["TotalRecords"] != DBNull.Value)
                                totalRecords = Convert.ToInt32(sdr["TotalRecords"]);

                            list.Add(new employeeRegistration
                            {
                                Id = Convert.ToInt32(sdr["id"]),
                                EmpCode = sdr["empCode"] != DBNull.Value ? Convert.ToInt32(sdr["empCode"]) : (int?)null,
                                EmpRoleId = sdr["empRole"] != DBNull.Value ? Convert.ToInt32(sdr["empRole"]) : (int?)null,
                                roleName = sdr["roleName"]?.ToString(),
                                EmpName = sdr["empName"]?.ToString(),
                                Mobile = sdr["mobile"]?.ToString(),
                                DepartmentId = sdr["department"] != DBNull.Value ? Convert.ToInt32(sdr["department"]) : (int?)null,
                                departmentName = sdr["departmentName"]?.ToString(),
                                DesignationId = sdr["designation"] != DBNull.Value ? Convert.ToInt32(sdr["designation"]) : (int?)null,
                                designationName = sdr["designationName"]?.ToString(),
                                ReportingManagerId = sdr["reportingManager"] != DBNull.Value ? Convert.ToInt32(sdr["reportingManager"]) : (int?)null,
                                AadharImgPath = sdr["aadharImg"]?.ToString(),
                                PanImgPath = sdr["panImg"]?.ToString(),
                                EmailId = sdr["emailId"]?.ToString(),
                                DateOfJoining = sdr["dateOfJoining"] != DBNull.Value ? Convert.ToDateTime(sdr["dateOfJoining"]) : DateTime.MinValue,
                                Salary = sdr["salary"] != DBNull.Value ? Convert.ToInt32(sdr["salary"]) : (int?)null,
                                ProfilePicPath = sdr["profilePic"]?.ToString(),
                                BankName = sdr["bankName"]?.ToString(),
                                AccountNo = sdr["accountNo"]?.ToString(),
                                IfscCode = sdr["ifscCode"]?.ToString(),
                                BankBranch = sdr["bankBranch"]?.ToString(),
                                Dob = sdr["dob"] != DBNull.Value ? Convert.ToDateTime(sdr["dob"]) : DateTime.MinValue,
                                Gender = sdr["gender"]?.ToString(),
                                Nationality = sdr["nationality"]?.ToString(),
                                MaritalStatus = sdr["maritalStatus"]?.ToString(),
                                PresentAddress = sdr["presentAddress"]?.ToString(),
                                StateId = sdr["state"] != DBNull.Value ? Convert.ToInt32(sdr["state"]) : (int?)null,
                                CityId = sdr["city"] != DBNull.Value ? Convert.ToInt32(sdr["city"]) : (int?)null,
                                Pincode = sdr["pincode"]?.ToString(),
                                EmergencyContactPersonName = sdr["emergencyContactPersonName"]?.ToString(),
                                EmergencyContactNum = sdr["emergenctContactNum"]?.ToString(),
                                CompanyName = sdr["city"] != DBNull.Value ? sdr["companyName"]?.ToString() : null,
                                Technology = sdr["technology"] != DBNull.Value ? sdr["technology"]?.ToString() : null,
                                CompanyContactNo = sdr["companyContactNo"] != DBNull.Value ? sdr["companyContactNo"]?.ToString() : null,
                                ExperienceCertificatePath = sdr["experienceCertificate"] != DBNull.Value ? sdr["experienceCertificate"]?.ToString() : null,
                                TenthCertificatePath = sdr["tenthCertificate"] != DBNull.Value ? sdr["tenthCertificate"]?.ToString() : null,
                                TwelthCertificatePath = sdr["twelthCertificate"] != DBNull.Value ?
                                sdr["twelthCertificate"]?.ToString() : null,

                                GraduationCertificatePath = sdr["graduationCertificate"] != DBNull.Value ?
                                sdr["graduationCertificate"]?.ToString() : null,

                                MastersCertificatePath = sdr["mastersCertificate"] != DBNull.Value ? sdr["mastersCertificate"]?.ToString() : null,
                                YearOfExperience = sdr["yearOfExperience"] != DBNull.Value ? Convert.ToInt32(sdr["yearOfExperience"]) : (int?)null,
                                stateName = sdr["stateName"] != DBNull.Value ? sdr["stateName"].ToString() : null,
                                cityName = sdr["cityName"] != DBNull.Value ? sdr["cityName"].ToString() : null
                            });
                        }
                    }
                }

                if (!list.Any())
                {
                    return ApiResponse<List<employeeRegistration>>.FailureResponse(
                        "Employee not found",
                        404,
                        "EMPLOYEE_NOT_FOUND"
                    );
                }


                return ApiResponse<List<employeeRegistration>>.SuccessResponse(
                    list,
                    "Employee fetched successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<List<employeeRegistration>>.FailureResponse(
                    ex.Message,
                    500,
                    "EMPLOYEE_FETCH_ERROR"
                );
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }


        public async Task<bool> UpdateEmployeeRegistrationData(employeeRegistration data)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_Employee", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "updateEmployee");

                    cmd.Parameters.AddWithValue("@id", data.Id);
                    cmd.Parameters.AddWithValue("@empRole", data.EmpRoleId);
                    cmd.Parameters.AddWithValue("@empCode", data.EmpCode);
                    cmd.Parameters.AddWithValue("@empName", data.EmpName);
                    cmd.Parameters.AddWithValue("@mobile", data.Mobile);
                    cmd.Parameters.AddWithValue("@department", data.DepartmentId);
                    cmd.Parameters.AddWithValue("@designation", data.DesignationId);
                    cmd.Parameters.AddWithValue("@reportingManager",
                        (object?)data.ReportingManagerId ?? DBNull.Value);

                    cmd.Parameters.AddWithValue("@profilePic", (object?)data.ProfilePicPath ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@aadharImg", (object?)data.AadharImgPath ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@panImg", (object?)data.PanImgPath ?? DBNull.Value);

                    cmd.Parameters.AddWithValue("@dateOfJoining", data.DateOfJoining);
                    cmd.Parameters.AddWithValue("@salary", data.Salary);

                    cmd.Parameters.AddWithValue("@bankName", data.BankName);
                    cmd.Parameters.AddWithValue("@accountNo", data.AccountNo);
                    cmd.Parameters.AddWithValue("@ifscCode", data.IfscCode);
                    cmd.Parameters.AddWithValue("@bankBranch", data.BankBranch);

                    cmd.Parameters.AddWithValue("@dob", data.Dob);
                    cmd.Parameters.AddWithValue("@gender", data.Gender);
                    cmd.Parameters.AddWithValue("@nationality", data.Nationality);
                    cmd.Parameters.AddWithValue("@maritalStatus", data.MaritalStatus);

                    cmd.Parameters.AddWithValue("@presentAddress", data.PresentAddress);
                    cmd.Parameters.AddWithValue("@state", data.StateId);
                    cmd.Parameters.AddWithValue("@city", data.CityId);
                    cmd.Parameters.AddWithValue("@pincode", data.Pincode);

                    cmd.Parameters.AddWithValue("@emergencyContactPersonName", data.EmergencyContactPersonName);
                    cmd.Parameters.AddWithValue("@emergenctContactNum", data.EmergencyContactNum);

                    cmd.Parameters.AddWithValue("@companyName", data.CompanyName);
                    cmd.Parameters.AddWithValue("@yearOfExperience", data.YearOfExperience);
                    cmd.Parameters.AddWithValue("@technology", data.Technology);
                    cmd.Parameters.AddWithValue("@companyContactno", data.CompanyContactNo);

                    cmd.Parameters.AddWithValue("@experienceCertificate",
                        (object?)data.ExperienceCertificatePath ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@tenthCertificate",
                        (object?)data.TenthCertificatePath ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@twelthCertificate",
                        (object?)data.TwelthCertificatePath ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@graduationCertificate",
                        (object?)data.GraduationCertificatePath ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@mastersCertificate",
                        (object?)data.MastersCertificatePath ?? DBNull.Value);

                    if (_conn.State == ConnectionState.Closed)
                        await _conn.OpenAsync();

                    object result = await cmd.ExecuteScalarAsync();
                    return Convert.ToBoolean(result);
                }
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    _conn.Close();
            }
        }

        #endregion


        #region leave api

        public async Task<int> InsertRole(Leave data)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_leave", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;


                    cmd.Parameters.AddWithValue("@leaveType", data.leaveName);
                    cmd.Parameters.AddWithValue("@description", data.description);
                    cmd.Parameters.AddWithValue("@id", data.Id);
                    cmd.Parameters.AddWithValue("@action", data.Id > 0 ? "updateLeave" : "insertLeave");


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


            public async Task<ApiResponse<List<Leave>>> getAllLeave(string? searchTerm,int? pageNumber,int? pageSize)
            {
            List<Leave> list = new();
            int totalRecords = 0;

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_leave", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "selectAllLeave");

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

                            list.Add(new Leave
                            {
                                Id = Convert.ToInt32(sdr["id"]),
                                leaveName =sdr["leaveType"] !=DBNull.Value? sdr["leaveType"].ToString():null,
                                description =sdr["description"] !=DBNull.Value? sdr["description"].ToString():null,
                            });
                        }
                    }
                }


                if (pageNumber.HasValue && pageSize.HasValue)
                {
                    return ApiResponse<List<Leave>>.PagedResponse(
                        list,
                        pageNumber.Value,
                        pageSize.Value,
                        totalRecords,
                        "Leave list fetched successfully");
                }


                var response = ApiResponse<List<Leave>>.SuccessResponse(
                    list,
                    "Leave list fetched successfully");

                response.TotalRecords = totalRecords;

                return response;
            }
            catch (Exception ex)
            {
                return ApiResponse<List<Leave>>.FailureResponse(
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


        public async Task<ApiResponse<List<Leave>>> getAllLeaveById(int id)
        {
            List<Leave> list = new();

            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_leave", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "selectLeaveById");
                    cmd.Parameters.AddWithValue("@id", id);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            list.Add(new Leave
                            {
                                Id = Convert.ToInt32(sdr["id"]),
                                leaveName = sdr["leaveType"] != DBNull.Value ? sdr["leaveType"].ToString() : null,
                                description = sdr["description"] != DBNull.Value ? sdr["description"].ToString() : null,
                            });
                        }
                    }
                }

                if (!list.Any())
                {
                    return ApiResponse<List<Leave>>.FailureResponse(
                        "Leave not found",
                        404,
                        "Leave_NOT_FOUND"
                    );
                }


                return ApiResponse<List<Leave>>.SuccessResponse(
                    list,
                    "Leave fetched successfully"
                );
            }
            catch (Exception ex)
            {
                return ApiResponse<List<Leave>>.FailureResponse(
                    ex.Message,
                    500,
                    "Leave_FETCH_ERROR"
                );
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }

        public async Task<bool> deleteLeaveById(int id)
        {
            try
            {
                SqlCommand cmd = new SqlCommand("sp_leave", _conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@id",id);
                cmd.Parameters.AddWithValue("@action ","deleteLeaveById");
                if (_conn.State != ConnectionState.Open)
                    await _conn.OpenAsync();
                int row = await cmd.ExecuteNonQueryAsync();
                return row > 0;
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

        public async Task<int> InsertAssignLeaveAsync(int empId, string noOfLeave, string leaveType)
        {
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_assignLeave", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@empId", empId);
                    cmd.Parameters.AddWithValue("@leaveType", leaveType);
                    cmd.Parameters.AddWithValue("@noOfLeave", noOfLeave);
                    cmd.Parameters.AddWithValue("@action", "assignLeaveToEmp");

                    SqlParameter result = new SqlParameter("@result", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(result);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    await cmd.ExecuteNonQueryAsync();

                    return result.Value != DBNull.Value
                        ? Convert.ToInt32(result.Value)
                        : 0;
                }
            }
            catch (Exception ex)
            {
             
                throw; 
            }
            finally
            {
                if (_conn.State == ConnectionState.Open)
                    await _conn.CloseAsync();
            }
        }


        public async Task<ApiResponse<List<showLeave>>> getAllAssignedLeaveById(int empId)
        {
            List<showLeave> list = new List<showLeave>();
            try
            {
                using (SqlCommand cmd = new SqlCommand("sp_assignLeave", _conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@action", "getEmpAssignedLeaveById");
                    cmd.Parameters.AddWithValue("@empId", empId);

                    if (_conn.State != ConnectionState.Open)
                        await _conn.OpenAsync();

                    using (SqlDataReader sdr = await cmd.ExecuteReaderAsync())
                    {
                        while (await sdr.ReadAsync())
                        {
                            list.Add(new showLeave
                            {
                                id = Convert.ToInt32(sdr["id"]),
                                leaveType = sdr["leaveType"] != DBNull.Value
                                                    ? sdr["leaveType"].ToString()
                                                    : "",
                                noOfLeave = sdr["noOfLeave"] != DBNull.Value ? Convert.ToInt32(sdr["noOfLeave"]):(int?)null
                            });
                        }
                    }
                }

                if (list.Any())
                {
                    return ApiResponse<List<showLeave>>.SuccessResponse(
                        list,
                        "Assigned leave fetched successfully."
                    );
                }
                else
                {
                    return ApiResponse<List<showLeave>>.FailureResponse(
                        "No assigned leave found.",
                        404
                    );
                }
            }
            catch (Exception ex)
            {
                return ApiResponse<List<showLeave>>.FailureResponse(
                    "An error occurred while fetching assigned leave.",
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


        #endregion 

    }
}
