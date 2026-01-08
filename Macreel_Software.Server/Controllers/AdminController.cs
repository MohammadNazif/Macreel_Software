using Macreel_Software.DAL.Admin;
using Macreel_Software.DAL.Admin;
using Macreel_Software.DAL.Common;
using Macreel_Software.Models;
using Macreel_Software.Models.Common;
using Macreel_Software.Models.Master;
using Macreel_Software.Server;
using Macreel_Software.Services.FileUpload.Services;
using Macreel_Software.Services.MailSender;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Macreel_Software.Server.Controllers
{
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
            PasswordEncrypt pass)
        {
            _services = service;
            _fileUploadService = fileUploadService;
            _env = env;
            _mailservice = mailservice;
            _pass = pass;
        }




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

                string dbMessage = await _services.InsertEmployeeRegistrationData(model);

                if (dbMessage.Contains("Email already exists"))
                {
                    return BadRequest(new
                    {
                        status = false,
                        statusCode = 409,
                        message = dbMessage, 
                        emailStatus = false,
                        emailMessage = "Email not sent"
                    });
                }

                if (!dbMessage.Contains("success"))
                {
                    return BadRequest(new
                    {
                        status = false,
                        statusCode = 400,
                        message = dbMessage,
                        emailStatus = false,
                        emailMessage = "Email not sent"
                    });
                }

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



        [HttpGet("getReportingManager")]
        public async Task<IActionResult> GetReportingManager()
        {
            try
            {
                var result = await _services.GetAllReportingManager();

                if (result != null && result.Any())
                {
                    return Ok(ApiResponse<List<ReportingManger>>.SuccessResponse(
                        result,
                        "Reporting manager fetched successfully"
                    ));
                }

                return Ok(ApiResponse<List<ReportingManger>>.FailureResponse(
                    "No data found",
                    404
                ));
            }
            catch (Exception)
            {
                return StatusCode(500,
                    ApiResponse<List<ReportingManger>>.FailureResponse(
                        "An error occurred while fetching reporting managers",
                        500,
                        "SERVER_ERROR"
                    ));
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



    }
}
