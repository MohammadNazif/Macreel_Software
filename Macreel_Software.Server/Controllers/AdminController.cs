using Macreel_Software.DAL.Admin;
using Macreel_Software.Models;
using Macreel_Software.Models.Common;
using Macreel_Software.Models.Master;
using Macreel_Software.Services.FileUpload.Services;
using Macreel_Software.Services.MailSender;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Macreel_Software.Server.Controllers
{
    [Authorize(Roles = "admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminServices _services;
        private readonly FileUploadService _fileUploadService;
        private readonly IWebHostEnvironment _env;
        private readonly MailSender _mailservice;
        private readonly PasswordEncrypt _pass;

        public AdminController(
            IAdminServices service,
            FileUploadService fileUploadService,
            IWebHostEnvironment env,
            MailSender mailservice,
            PasswordEncrypt pass, IHttpContextAccessor http)
        {
            _services = service;
            _fileUploadService = fileUploadService;
            _env = env;
            _mailservice = mailservice;
            _pass = pass;
        
        }

        [HttpGet("checkauth")]
        public IActionResult CheckAuth()
        {
            return Ok(new
            {
                StatusCode = 200,
                message = "ho gya"
            });
        }


        #region employee api
        [HttpPost("insertEmployeeRegistration")]
        public async Task<IActionResult> InsertEmployee([FromForm] employeeRegistration model)
        {
            try
            {
                string uploadRoot = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadRoot))
                    Directory.CreateDirectory(uploadRoot);

                string[] imgExt = { ".jpg", ".jpeg", ".png" };
                string[] docExt = { ".pdf", ".jpg", ".jpeg", ".png" };

                async Task<string> UploadFile(IFormFile file, string[] allowedExt)
                {
                    if (file == null) return "";
                    return "/uploads/" + await _fileUploadService.UploadFileAsync(file, uploadRoot, allowedExt);
                }

                // ✅ Upload files
                model.ProfilePicPath = await UploadFile(model.ProfilePic, imgExt);
                model.AadharImgPath = await UploadFile(model.AadharImg, imgExt);
                model.PanImgPath = await UploadFile(model.PanImg, imgExt);
                model.ExperienceCertificatePath = await UploadFile(model.ExperienceCertificate, docExt);
                model.TenthCertificatePath = await UploadFile(model.TenthCertificate, docExt);
                model.TwelthCertificatePath = await UploadFile(model.TwelthCertificate, docExt);
                model.GraduationCertificatePath = await UploadFile(model.GraduationCertificate, docExt);
                model.MastersCertificatePath = await UploadFile(model.MastersCertificate, docExt);

                string plainPassword = model.Password;
                model.Password = _pass.EncryptPassword(model.Password);

                // ✅ Call Service
                string dbMessage = await _services.InsertEmployeeRegistrationData(model);

                if (dbMessage.Contains("Email already exists"))
                    return Conflict(new { status = false, statusCode = 409, message = dbMessage });

                if (!dbMessage.ToLower().Contains("success"))
                    return BadRequest(new { status = false, statusCode = 400, message = dbMessage });

                // ✅ Send email
                bool emailStatus = false;
                string emailMessage = "Email not sent";

                try
                {
                    var mailRequest = new MailRequest
                    {
                        ToEmail = model.EmailId,
                        Subject = "Your Account Credentials - Macreel Infosoft Pvt. Ltd.",
                        BodyType = MailBodyType.UserCredential,
                        UserName = model.EmailId,
                        Password = plainPassword
                    };

                    var mailResponse = await _mailservice.SendMailAsync(mailRequest);
                    emailStatus = mailResponse.Status;
                    emailMessage = mailResponse.Message;
                }
                catch (Exception mailEx)
                {
                    emailMessage = "Email sending failed: " + mailEx.Message;
                }

                string combinedMessage = dbMessage + (emailStatus ? " | Credentials sent to email successfully."
                                                                   : " | " + emailMessage);

                return Ok(new
                {
                    status = true,
                    statusCode = 201,
                    message = combinedMessage,
                    emailStatus,
                    emailMessage
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    status = false,
                    statusCode = 500,
                    message = "Registration failed: " + ex.Message,
                    emailStatus = false,
                    emailMessage = "Email not sent"
                });
            }
        }



        [HttpGet("GetAllEmployees")]
        public async Task<IActionResult> GetAllEmployees(
       string? searchTerm,
       int? pageNumber,
       int? pageSize)
        {
            try
            {
                ApiResponse<List<employeeRegistration>> result =
                    await _services.GetAllEmpData(searchTerm, pageNumber, pageSize);

                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500,
                    ApiResponse<List<employeeRegistration>>.FailureResponse(
                        "An error occurred while fetching employee data",
                        500,
                        "SERVER_ERROR"));
            }
        }



        [HttpDelete("deleteEmployeeById")]
        public async Task<IActionResult> deleteEmployeeById(int id)
        {
            var res = await _services.deleteEmployeeById(id);

            if (res)
            {
                return Ok(new
                {
                    status = true,
                    StatusCode = 200,
                    message = "Employee deleted successfully!!!"
                });
            }

            return NotFound(new
            {
                status = false,
                StatusCode = 404,
                message = "Employee not found or already deleted!"
            });
        }

        [HttpGet("getEmployeeById")]
        public async Task<IActionResult> getemployeeById(int id)
        {
            try
            {

                var result = await _services.GetAllEmpDataById(id);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<role>.FailureResponse(
                    "An error occurred while fetching employee.",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }



        [HttpPost("updateEmployeeRegistration")]
        public async Task<IActionResult> UpdateEmployee([FromForm] employeeRegistration model)
        {
            try
            {
                string uploadRoot = Path.Combine(_env.WebRootPath, "uploads");
                if (!Directory.Exists(uploadRoot))
                    Directory.CreateDirectory(uploadRoot);

                string[] imgExt = { ".jpg", ".jpeg", ".png" };
                string[] docExt = { ".pdf", ".jpg", ".jpeg", ".png" };

                async Task<string?> UploadFile(IFormFile file, string[] allowedExt)
                {
                    if (file == null || file.Length == 0)
                        return null;

                    return "/uploads/" + await _fileUploadService
                        .UploadFileAsync(file, uploadRoot, allowedExt);
                }

                model.ProfilePicPath = await UploadFile(model.ProfilePic, imgExt);
                model.AadharImgPath = await UploadFile(model.AadharImg, imgExt);
                model.PanImgPath = await UploadFile(model.PanImg, imgExt);

                model.ExperienceCertificatePath = await UploadFile(model.ExperienceCertificate, docExt);
                model.TenthCertificatePath = await UploadFile(model.TenthCertificate, docExt);
                model.TwelthCertificatePath = await UploadFile(model.TwelthCertificate, docExt);
                model.GraduationCertificatePath = await UploadFile(model.GraduationCertificate, docExt);
                model.MastersCertificatePath = await UploadFile(model.MastersCertificate, docExt);

                bool isUpdated = await _services.UpdateEmployeeRegistrationData(model);

                if (!isUpdated)
                {
                    return BadRequest(new
                    {
                        status = false,
                        statusCode = 400,
                        message = "Employee update failed"
                    });
                }

                return Ok(new
                {
                    status = true,
                    statusCode = 200,
                    message = "Employee updated successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    statusCode = 500,
                    message = "Update failed: " + ex.Message
                });
            }
        }

        #endregion

        #region leave api

        [HttpPost("insertLeave")]
        public async Task<IActionResult> insertLeave([FromBody] Leave data)
        {
            try
            {
                int result = await _services.InsertLeave(data);

                if (result == 1)
                {
                    return Ok(new
                    {
                        status = true,
                        statusCode = 200,
                        message = "Leave Inserted Successfully!!"
                    });
                }

                if (result == 2)
                {
                    return Ok(new
                    {
                        status = true,
                        statusCode = 200,
                        message = "Leave Updated Successfully!!"
                    });
                }

                if (result == -1)
                {
                    return Ok(new
                    {
                        status = false,
                        statusCode = 400,
                        message = "Leave already exists!!"
                    });
                }

                return Ok(new
                {
                    status = false,
                    statusCode = 400,
                    message = "Some error occured during leave insertion!!"
                });
            }
            catch (Exception)
            {
                return Ok(new
                {
                    status = false,
                    statusCode = 500,
                    message = "Internal Server error!!"
                });
            }
        }

        [HttpGet("getLeaveById")]
        public async Task<IActionResult> getLeaveById(int id)
        {
            try
            {

                var result = await _services.getAllLeaveById(id);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<Leave>.FailureResponse(
                    "An error occurred while fetching role.",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }


        [HttpDelete("DeleteLeaveById")]
        public async Task<IActionResult> deleteLeaveById(int id)
        {
            try
            {
                bool res = await _services.deleteLeaveById(id);
                if (res)
                {
                    return Ok(new
                    {
                        status = true,
                        StatusCode = 200,
                        message = "Leave deleted successfully!!"
                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = false,
                        StatusCode = 400,
                        messsag = "Leave not deleted!!"
                    });
                }
            }
            catch
            {

                return Ok(new
                {
                    StatusCode = 500,
                    status = false,
                    message = "Interval server error!!"
                });
            }
        }

        [HttpPost("AssignLeave")]
        public async Task<IActionResult> AssignLeave([FromBody] AssignLeave obj)
        {
            try
            {


                if (obj.EmployeeId <= 0 ||
                    string.IsNullOrWhiteSpace(obj.Leave) ||
                    string.IsNullOrWhiteSpace(obj.LeaveNo))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "EmployeeId, Leave and LeaveNo are required"
                    });
                }

                var leaveTypes = obj.Leave.Split(',', StringSplitOptions.RemoveEmptyEntries);
                var leaveNos = obj.LeaveNo.Split(',', StringSplitOptions.RemoveEmptyEntries);

                if (leaveTypes.Length != leaveNos.Length)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Leave count and Leave type mismatch"
                    });
                }

                int row = 0;

                for (int i = 0; i < leaveTypes.Length; i++)
                {
                    row = await _services.InsertAssignLeaveAsync(
                        obj.EmployeeId,
                        leaveNos[i].Trim(),
                        leaveTypes[i].Trim()
                    );
                }

                if (row > 0)
                {
                    return Ok(new
                    {
                        status = true,
                        StatusCode = 200,
                        message = "Leave assigned successfully!!"
                    });
                }

                return BadRequest(new
                {
                    status = false,
                    StatusCode = 400,
                    message = "Leave not assigned!!"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = "Internal server error",
                    error = ex.Message
                });
            }
        }


        [HttpGet("getAssignedLeaveById")]
        public async Task<IActionResult> getAssignedLeaveById(int empId)
        {
            try
            {

                var result = await _services.getAllAssignedLeaveById(empId);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<showLeave>.FailureResponse(
                    "An error occurred while fetching assigned leave.",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }


        [HttpGet("getAllAssignLeave")]
        public async Task<IActionResult> getAllAssignLeave(string? searchTerm = null, int? pageNumber = null, int? pageSize = null)
        {
            try
            {
                ApiResponse<List<AssignLeaveDetails>> result =
                    await _services.getAllAssignedLeave(searchTerm, pageNumber, pageSize);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<AssignLeaveDetails>>.FailureResponse(
                    "An error occurred while fetching leave",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }



        #endregion

        #region attendance 

        [HttpPost("uploadAttendance")]
        public async Task<IActionResult> UploadAttendance([FromForm] AttendanceUploadRequest request)
        {
            if (request.File == null)
                return BadRequest("Excel file required");

            int inserted = await _services.UploadAttendance(request.File, request.Month, request.Year);

            if (inserted > 0)
            {
                return Ok(new
                {
                    status = true,
                    statusCode = 200,
                    message = "Attendance uploaded successfully",
                    insertedRecords = inserted
                });
            }
            else
            {
                return Ok(new
                {
                    status = false,
                    statusCode = 400,
                    message = "Some error occured!!"

                });
            }
        }

        [HttpGet("EmpAttendancebyEmpCode")]
        public async Task<IActionResult> GetAttendanceByEmpCode([FromQuery] string empCode, [FromQuery] int month, [FromQuery] int year)
        {
            if (string.IsNullOrWhiteSpace(empCode))
                return BadRequest(ApiResponse<List<Attendance>>.FailureResponse(
                    "Employee code is required",
                    400,
                    errorCode: "EMP_CODE_REQUIRED"
                ));

            var result = await _services.EmpAttendanceDataByEmpCode(empCode, month, year);

            return StatusCode(result.StatusCode, result);
        }


        [HttpGet("EmpMonthlyWorkingDetailByEmpCode")]
        public async Task<IActionResult> EmpMonthlyWorkingDetailByEmpCode(int empCode, int month, int year)
        {
            try
            {
                var result = await _services.EmpWorkingDetailsByempCode(empCode, month, year);

                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<EmpWorkingDetails>.FailureResponse(
                    "An error occurred while fetching employee work details.",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }
        #endregion

        #region add project


        [HttpPost("add-update-Project")]
        public async Task<IActionResult> AddOrUpdateProject([FromForm] project data)
        {
            if (string.IsNullOrWhiteSpace(data.projectTitle))
                return BadRequest("Project title is required.");

            if (data.sopDocument == null)
                return BadRequest("SOP document is required.");

            if (data.startDate == null)
                return BadRequest("Start date is required.");

            if (data.assignDate == null)
                return BadRequest("Assign date is required.");

            if (data.assignDate < data.startDate)
                return BadRequest("Assign date cannot be less than start date.");

            if (data.endDate != null &&
                (data.endDate <= data.startDate || data.endDate <= data.assignDate))
                return BadRequest("End date must be greater than start date and assign date.");

            if (data.completionDate != null &&
                (data.completionDate <= data.startDate || data.completionDate <= data.assignDate))
                return BadRequest("Completion date must be greater than start date and assign date.");

            if (data.category != null && data.category.Equals("Software", StringComparison.OrdinalIgnoreCase))
            {
                bool isAnySoftwareSelected = !string.IsNullOrWhiteSpace(data.web) || !string.IsNullOrWhiteSpace(data.app) ||
                    !string.IsNullOrWhiteSpace(data.androidApp) || !string.IsNullOrWhiteSpace(data.IOSApp);

                if (!isAnySoftwareSelected)
                {
                    return BadRequest("Please select at least one software type.");
                }
            }

            // 🔹 File Upload
            var uploadService = new FileUploadService();
            string uploadRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            Directory.CreateDirectory(uploadRoot);

            if (data.sopDocument != null)
            {
                data.sopDocumentPath = await uploadService.UploadFileAsync(
                    data.sopDocument,
                    uploadRoot,
                    new[] { ".pdf", ".doc", ".docx" }
                );
            }

            if (data.technicalDocument != null)
            {
                data.technicalDocumentPath = await uploadService.UploadFileAsync(
                    data.technicalDocument,
                    uploadRoot,
                    new[] { ".pdf", ".doc", ".docx" }
                );
            }

            bool result = await _services.AddProject(data);

            if (!result)
                return Ok(new
                {
                    status = false,
                    message = "Project no saved"
                });

            return Ok(new
            {
                success = true,
                StatusCode = 200,
                message = data.id > 0
                    ? "Project updated successfully."
                    : "Project added successfully."
            });
        }



        [HttpGet("getAllProject")]
        public async Task<IActionResult> getAllProject(string? searchTerm = null, int? pageNumber = null, int? pageSize = null)
        {
            try
            {
                ApiResponse<List<project>> result =
                    await _services.GetAllProject(searchTerm, pageNumber, pageSize);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<project>>.FailureResponse(
                    "An error occurred while fetching project details",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }

        [HttpGet("getProjectDetailsByEmpId")]
        public async Task<IActionResult> getProjectDetailsById(int empId)
        {
            try
            {
                ApiResponse<List<project>> result =
                    await _services.GetEmpProjectDetailByEmpId(empId);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<project>>.FailureResponse(
                    "An error occurred while fetching project details",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }
        [HttpGet("getAllProjectById")]
        public async Task<IActionResult> getAllProjectById(int id)
        {
            try
            {
                ApiResponse<List<project>> result =
                    await _services.GetAllProjectById(id);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<project>>.FailureResponse(
                    "An error occurred while fetching project details",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }


        [HttpDelete("deleteProjectById")]
        public async Task<IActionResult> deleteProjectById(int id)
        {
            try
            {
                var res = await _services.deleteProjectById(id);
                if (res)
                {
                    return Ok(new
                    {
                        status = true,
                        StatusCode = 200,
                        message = "Project deleted successfully!!!"

                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = false,
                        StatusCode = 404,
                        message = "Project not deleted!!"
                    });
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, new
                {
                    status = false,
                    StatusCode = 500,
                    message = "An error occurred while deleting Project.",
                    error = ex.Message
                });
            }
        }

        [HttpPost("insert-update-Task")]
        public async Task<IActionResult> insertUpdateTask([FromForm] Taskassign data)
        {
            if (data == null)
            {
                return BadRequest(new
                {
                    status = false,
                    statusCode = 400,
                    message = "Invalid request data."
                });
            }

            try
            {
                string folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var fileService = new FileUploadService();

                if (data.document1 != null)
                {
                    data.document1Path = await fileService.UploadFileAsync(
                        data.document1,
                        folderPath,
                        allowedExtensions: null 
                    );
                }

                if (data.document2 != null)
                {
                    data.document2Path = await fileService.UploadFileAsync(
                        data.document2,
                        folderPath,
                        allowedExtensions: null
                    );
                }

                bool res = await _services.insertTask(data);

                if (res)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                         null,
                       data.id>0?"Task update & assign successfully":  "Task Create & Assign inserted successfully"
                     ));
                }
                else
                {
                    return BadRequest(ApiResponse<object>.FailureResponse(
                      data.id>0?"Some error occured while updating Task and assign":  "Some error occurred while saving Task Create & Assign response",
                        400
                    ));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<object>.FailureResponse(
                   $"Internal server error: {ex.Message}",
                   500
               ));
            }
        }


        [HttpGet("getAllAssignTask")]
        public async Task<IActionResult> getAllAssignTask(string? searchTerm = null, int? pageNumber = null, int? pageSize = null)
        {
            try
            {
                ApiResponse<List<Taskassign>> result =
                    await _services.getAllAssignTask(searchTerm, pageNumber, pageSize);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<Taskassign>>.FailureResponse(
                    "An error occurred while fetching assign task details",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }


        [HttpGet("getAllTaskById")]
        public async Task<IActionResult> getAllTaskById(int id)
        {
            try
            {
                ApiResponse<List<Taskassign>> result =
                    await _services.getAllAssignTaskById(id);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<Taskassign>>.FailureResponse(
                    "An error occurred while fetching project details",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }


        [HttpDelete("deleteTaskAssignById")]
        public async Task<IActionResult> deleteTaskAssignById(int id)
        {
            try
            {
                var res = await _services.deleteTaskById(id);
                if (res)
                {
                    return Ok(new
                    {
                        status = true,
                        StatusCode = 200,
                        message = "Assign task deleted successfully!!!"

                    });
                }
                else
                {
                    return Ok(new
                    {
                        status = false,
                        StatusCode = 404,
                        message = "Assign Task not deleted!!"
                    });
                }
            }
            catch (Exception ex)
            {

                return StatusCode(500, new
                {
                    status = false,
                    StatusCode = 500,
                    message = "An error occurred while deleting task.",
                    error = ex.Message
                });
            }
        }

        #endregion
    }
}
