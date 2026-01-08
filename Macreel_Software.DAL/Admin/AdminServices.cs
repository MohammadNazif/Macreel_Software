using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FirebaseAdmin.Messaging;
using Macreel_Software.Models;
using Macreel_Software.Models.Master;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

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

                    cmd.Parameters.AddWithValue("@status", 1);

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

    }
}
