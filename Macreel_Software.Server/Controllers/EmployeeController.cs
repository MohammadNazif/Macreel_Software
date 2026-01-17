using Macreel_Software.DAL.Employee;
using Macreel_Software.Models;
using Macreel_Software.Models.Employee;
using Microsoft.AspNetCore.Mvc;
namespace Macreel_Software.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _service;
        private readonly int _userId;

        public EmployeeController(IEmployeeService service,IHttpContextAccessor http)
        {
            _service = service;
            var user = http.HttpContext?.User;
            if(user != null && user.Identity?.IsAuthenticated == true)
            {
                _userId = Convert.ToInt32(user.FindFirst("UserId")?.Value);
            }
        }

        [HttpPost("saveRuleBookResponseByEmpId")]
        public async Task<IActionResult> SaveRuleBookResponse([FromForm] EmployeeData data)
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
                bool res = await _service.insertResponseByEmpId(data);

                if (res)
                {
                    return Ok(ApiResponse<object>.SuccessResponse(
                         null,
                         "RuleBook inserted successfully"
                     ));
                }
                else
                {

                    return BadRequest(ApiResponse<object>.FailureResponse(
                        "Some error occurred while saving rulebook response",
                        400
                    ));
                }
            }
            catch (Exception)
            {
                return StatusCode(500, ApiResponse<object>.FailureResponse(
                   "Internal server error",
                   500
               ));
            }
        }


        [HttpGet("AssignedLeaveListByEmpId")]
        public async Task<IActionResult> assignedLeaveList(int empId, string? searchTerm,int? pageNumber,int? pageSize)
        {
            try
            {
                ApiResponse<List<assignedLeave>> result =
                    await _service.AssignedLeaveListByEmpId(empId,searchTerm, pageNumber, pageSize);


                return StatusCode(result.StatusCode, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<List<assignedLeave>>.FailureResponse(
                    "An error occurred while fetching assigned role",
                    500,
                    "SERVER_ERROR"
                ));
            }
        }

        [HttpPost("insertApplyLeaveByEmpId")]
        public async Task<IActionResult> insertApplyLeaveByEmpId([FromForm] applyLeave data)
        {
            if (data == null)
            {
                return BadRequest(ApiResponse<object>.FailureResponse(
                    "Invalid request data.",
                    400
                ));
            }

            if (!data.fromDate.HasValue || !data.toDate.HasValue)
            {
                return BadRequest(ApiResponse<object>.FailureResponse(
                    "From date and To date are required.",
                    400
                ));
            }

            DateTime fromDate = data.fromDate.Value.Date;
            DateTime toDate = data.toDate.Value.Date;

            if (fromDate > toDate)
            {
                return BadRequest(ApiResponse<object>.FailureResponse(
                    "From date cannot be greater than To date.",
                    400
                ));
            }

            try
            {
                bool res = await _service.insertApplyLeaveByEmpId(data);

                return Ok(ApiResponse<object>.SuccessResponse(
                 null,
                    "Leave applied successfully"
                ));
            }
            catch (Exception ex)
            {
                return BadRequest(ApiResponse<object>.FailureResponse(
                    ex.Message,
                    400
                ));
            }
        }



    }
}
